// Check that service workers are registered
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}


var Task = function (name) {
    this.name = ko.observable(name);
}


var ViewModel = function () {
    // Data
    var self = this;
    //self.listName = ko.observable();
    self.todoTasks = ko.observableArray([]);
    self.todoTasks.id = "todo";

    self.doingTasks = ko.observableArray([]);
    self.doingTasks.id = "doing";

    self.doneTasks = ko.observableArray([]);
    self.doingTasks.id = "done";

    self.selectedTask = ko.observable();

    self.clearTask = function (data, event) {
        if (data === self.selectedTask()) {
            self.selectedTask(null);
        }

        if (data.name() === "") {
            self.todoTasks.remove(data);
            self.doingTasks.remove(data);
            self.doneTasks.remove(data);
        }
    };

    self.isTaskSelected = function (task) {
        return task === self.selectedTask();
    };

    self.addTodoTask = function () {
        var task = new Task("new");
        self.selectedTask(task);
        self.todoTasks.push(task);
    };
    self.addDoingTask = function () {
        var task = new Task("new");
        self.selectedTask(task);
        self.doingTasks.push(task);
    };
    self.addDoneTask = function () {
        var task = new Task("new");
        self.selectedTask(task);
        self.doneTasks.push(task);
    };
    self.save = function() {
        var todoTasks = ko.toJSON({ tasks: self.todoTasks });
        var doingTasks = ko.toJSON({ tasks: self.doingTasks });
        var doneTasks = ko.toJSON({ tasks: self.doneTasks });

        localStorage.setItem(
            "todoTasks",
            todoTasks
        );

        localStorage.setItem(
            "doingTasks",
            doingTasks
        );

        localStorage.setItem(
            "doneTasks",
            doneTasks
        );
    }
    self.restore = function() {
        var todoTasksJSON = localStorage.getItem("todoTasks");
        var todoTasks = $.map(JSON.parse(todoTasksJSON).tasks, function(item) {return new Task(item.name) });
        self.todoTasks(todoTasks);

        var doingTasksJSON = localStorage.getItem("doingTasks");
        var doingTasks = $.map(JSON.parse(doingTasksJSON).tasks, function(item) {return new Task(item.name) });
        self.doingTasks(doingTasks);

        var doneTasksJSON = localStorage.getItem("doneTasks");
        var doneTasks = $.map(JSON.parse(doneTasksJSON).tasks, function(item) {return new Task(item.name) });
        self.doneTasks(doneTasks);
    }

    self.trash = ko.observableArray([]);
    self.trash.id = "trash";

    self.myDropCallback = function (arg) {
        if (console) {
            console.log("Moved '" + arg.item.name() + "' from " + arg.sourceParent.id + " (index: " + arg.sourceIndex + ") to " + arg.targetParent.id + " (index " + arg.targetIndex + ")");
        }
    };
}


//control visibility, give element focus, and select the contents (in order)
ko.bindingHandlers.visibleAndSelect = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.visible.update(element, valueAccessor);
        if (valueAccessor()) {
            setTimeout(function () {
                $(element).find("input").focus().select();
            }, 0); //new tasks are not in DOM yet
        }
    }
};

var localStorage = window.localStorage;

// localStorage.clear();

var model = new ViewModel()
ko.applyBindings(model);