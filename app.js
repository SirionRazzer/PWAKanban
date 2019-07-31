// Check that service workers are registered
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/PWAKanban/sw.js');
    });
}

var savingLocked = true;

var Task = function (name) {
    this.name = ko.observable(name);
    this.name.subscribe(function () {
        model.save();
        console.log('item change');
    });
}

var ViewModel = function () {
    // Data
    var self = this;
    self.save = function () {
        if (!savingLocked) {
            var todoTasks = ko.toJSON({
                tasks: self.todoTasks
            });
            var doingTasks = ko.toJSON({
                tasks: self.doingTasks
            });
            var doneTasks = ko.toJSON({
                tasks: self.doneTasks
            });

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
    }
    //self.listName = ko.observable();
    self.todoTasks = ko.observableArray([]);
    self.todoTasks.id = "todo";
    self.todoTasks.subscribe(function () {
        self.save();
        console.log('todo list change');
    });

    self.doingTasks = ko.observableArray([]);
    self.doingTasks.id = "doing";
    self.doingTasks.subscribe(function () {
        self.save();
        console.log('doing list change');
    });

    self.doneTasks = ko.observableArray([]);
    self.doingTasks.id = "done";
    self.doneTasks.subscribe(function () {
        self.save();
        console.log('done list change');
    });

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

    self.clear = function () {
        self.todoTasks.removeAll();
        self.doingTasks.removeAll();
        self.doneTasks.removeAll();
    }

    self.isTaskSelected = function (task) {
        return task === self.selectedTask();
    };

    self.addTodoTask = function () {
        var task = new Task(" ");
        self.selectedTask(task);
        self.todoTasks.push(task);
    };
    self.addDoingTask = function () {
        var task = new Task(" ");
        self.selectedTask(task);
        self.doingTasks.push(task);
    };
    self.addDoneTask = function () {
        var task = new Task(" ");
        self.selectedTask(task);
        self.doneTasks.push(task);
    };
    self.restore = function () {
        var todoTasksJSON = localStorage.getItem("todoTasks");
        var doingTasksJSON = localStorage.getItem("doingTasks");
        var doneTasksJSON = localStorage.getItem("doneTasks");

        if (todoTasksJSON != null && doingTasksJSON != null && doneTasksJSON != null) {
            var todoTasks = $.map(JSON.parse(todoTasksJSON).tasks, function (item) {
                return new Task(item.name)
            });
            self.todoTasks(todoTasks);

            var doingTasks = $.map(JSON.parse(doingTasksJSON).tasks, function (item) {
                return new Task(item.name)
            });
            self.doingTasks(doingTasks);

            var doneTasks = $.map(JSON.parse(doneTasksJSON).tasks, function (item) {
                return new Task(item.name)
            });
            self.doneTasks(doneTasks);
        }

        savingLocked = false;
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

function clearLocalStorageAndRefresh() {
    console.log("asdasdfsdf");
    localStorage.clear();
    model.clear();
}

var model = new ViewModel()
ko.applyBindings(model);
model.restore();