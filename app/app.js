// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

function Task(data) {
    this.text = ko.observable(data.text);
    this.position = data.position;
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.listName = ko.observable();
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();

    // Operations
    self.tasksCount = function () {
        return self.tasks().length;
    }
    self.addTask = function () {
        self.tasks.push(new Task({
            text: this.newTaskText(),
            position: this.tasksCount()
        }));
        self.newTaskText("");
        hideModal();
    };
    self.swapTasks = function (position1, position2) {
        // var tmp = self.tasks()[position1];
        // self.tasks()[position1] = self.tasks()[position2];
        // self.tasks()[position2] = tmp;
        [self.tasks()[position1], self.tasks()[position2]] = [self.tasks()[position2], self.tasks()[position1]]
        self.tasks()[position1].position = position1;
        self.tasks()[position2].position = position2;
    };
    self.removeTask = function (task) {
        self.tasks.remove(task);
    };
    self.removeNthTask = function (position) {
        console.log("removing from position: " + position + " array size is: " + self.tasks().length);
        self.tasks.remove(self.tasks()[position]);
        for (var i = position; i < self.tasks().length; i++) {
            self.tasks()[i].position = i;
        }
    };

    // // Load initial state from server, convert it to Task instances, then populate self.tasks
    // $.getJSON("/tasks", function(allData) {
    //     var mappedTasks = $.map(allData, function(item) { return new Task(item) });
    //     self.tasks(mappedTasks);
    // });    
}

function hideModal() {
    $('#addModal').modal('hide');
}

var model = new TaskListViewModel()
var tmpPositionStart = 0;
var tmpPositionEnd = 0;
ko.applyBindings(model);

// Initialize Dragula
var drake = null
window.onload = function () {
    drake = dragula([document.getElementById('list1')], {
        removeOnSpill: true
    }).on('remove', function (el, container, source) {
        printArrayStatus("before");
        model.removeNthTask(tmpPositionStart);
        printArrayStatus("after");
    }).on('drag', function (el, source) {
        printArrayStatus("before");
        console.log("drag from position:" + elementPosition(el));
        tmpPositionStart = elementPosition(el);
    }).on('drop', function (el) {
        console.log("drop to position:" + elementPosition(el));
        tmpPositionEnd = elementPosition(el);
        if (tmpPositionStart != tmpPositionEnd) {
            model.swapTasks(tmpPositionStart, tmpPositionEnd);
        }
    });
    console.log(drake.containers);
}

function elementPosition(element) {
    if (element == null) return -1;
    if (element.parentNode == null) return -2;

    var position = 0;
    var children = element.parentNode.children;
    let array = [...children];
    console.log("childNodes: " + array.length);
    for (item of children) {
        if (element === item) break;
        position += 1;
    }
    return position;
}

function printArrayStatus(message) {
    console.log("-----------" + message + "----------");
    for (var i = 0; i < model.tasks().length; i++) {
        console.log(i + ". element => " + model.tasks()[i].text() + model.tasks()[i].position);
    }
    console.log("count of elements: " + model.tasks().length);
}