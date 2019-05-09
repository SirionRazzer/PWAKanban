// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

function Task(data) {
    this.text = ko.observable(data.text);
    this.position = ko.observable(data.position);
    this.isDone = ko.observable(data.isDone);
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.listName = ko.observable();
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function () {
        return ko.utils.arrayFilter(self.tasks(), function (task) {
            return !task.isDone()
        });
    });

    // Operations
    self.addTask = function () {
        self.tasks.push(new Task({
            text: this.newTaskText(),
            position: this.tasks().length,
            isDone: false
        })); //, position: this.tasks.length, isDone: false 
        self.newTaskText("");
        console.log(this.tasks().length);
        hideModal();
    };
    self.swapTasks = function (position1, position2) {
        var tmp = self.tasks[position1];
        self.tasks[position1] = self.tasks[position2];
        self.tasks[position2] = tmp;
    };
    self.removeTask = function (task) {
        self.tasks.remove(task)
    };
    self.removeNthTask = function (position) {
        self.tasks.remove(self.tasks()[position]);
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
        //el.className += ' ex-moved';
        console.log("remove");
        console.log("from position:" + elementPosition(source));
        console.log("tasks count:" + model.tasks().length);
    }).on('drag', function (el, source) {
        //el.className += ' ex-moved';
        console.log("drag");
        console.log("from position:" + elementPosition(el));
        tmpPositionStart = elementPosition(el);
    }).on('drop', function (el) {
        console.log("drop");
        console.log("to position:" + elementPosition(el));
        tmpPositionEnd = elementPosition(el);
        if (tmpPositionStart != tmpPositionEnd) {
            model.swapTasks(tmpPositionStart, tmpPositionEnd);
        }
    });
    console.log(drake.containers);
}

function elementPosition(element) {
    if (element == null) return 0;
    if (element.parentNode == null) return 0;

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