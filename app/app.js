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
            text: this.newTaskText()
        })); //, position: this.tasks.length, isDone: false 
        self.newTaskText("");
        console.log(this.tasks().length);
        hideModal();
    };
    self.removeTask = function (task) {
        self.tasks.remove(task)
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


// function toggleSpinner(enabled) {
//     if (enabled) {
//         document.getElementById("spinner").style.visibility = "visible";
//     } else {
//         document.getElementById("spinner").style.visibility = "invisible";
//     }
// } 

var model = new TaskListViewModel()
ko.applyBindings(model);

// Initialize Dragula
var drake = null
window.onload = function () {
    drake = dragula([document.getElementById('list1')], {
        removeOnSpill: true
    }).on('remove', function (el) {
        //el.className += ' ex-moved';
        console.log("remove");
        console.log(model.tasks().length);
    }).on('drop', function () {
        console.log("drop");
        console.log(model.tasks().length);
    });
    console.log(drake.containers);
}