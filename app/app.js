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
    self.todoTasks = ko.observableArray([
        new Task("Try to drag this item")
    ]);
    self.todoTasks.id = "todo";

    self.doingTasks = ko.observableArray([
        new Task("Try to trash this item")
    ]);
    self.doingTasks.id = "doing";

    self.selectedTask = ko.observable();
    self.clearTask = function (data, event) {
        if (data === self.selectedTask()) {
            self.selectedTask(null);
        }

        if (data.name() === "") {
            self.todoTasks.remove(data);
            self.doingTasks.remove(data);
        }
    };

    self.isTaskSelected = function (task) {
        return task === self.selectedTask();
    };

    self.addTask = function () {
        var task = new Task("new");
        self.selectedTask(task);
        self.todoTasks.push(task);
    };
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


var model = new ViewModel()
ko.applyBindings(model);