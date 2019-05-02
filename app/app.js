// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

// Initialize Dragula
var drake = null;
window.onload = function() {
    drake = dragula([document.getElementById('right1')]);
    console.log(drake.containers);
}

// Data view models
// function Item(itemText) {
//     var self = this;
//     self.text = ko.observable(itemText);
// }

// function ItemsViewModel() {
//     var self = this;

//     self.items = ko.observableArray([
//         new ItemsViewModel("item")
//     ]);
// }

// ko.applyBindings(new ItemsViewModel());

function Task(data) {
    this.title = ko.observable(data.title);
    this.isDone = ko.observable(data.isDone);
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
    });

    // Operations
    self.addTask = function() {
        self.tasks.push(new Task({ title: this.newTaskText() }));
        self.newTaskText("");
    };
    self.removeTask = function(task) { self.tasks.remove(task) };

    // // Load initial state from server, convert it to Task instances, then populate self.tasks
    // $.getJSON("/tasks", function(allData) {
    //     var mappedTasks = $.map(allData, function(item) { return new Task(item) });
    //     self.tasks(mappedTasks);
    // });    
}

ko.applyBindings(new TaskListViewModel());