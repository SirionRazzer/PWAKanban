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
    self.highPriorityTasks = ko.observableArray([
        new Task("Try to drag this item")
    ]);
    self.highPriorityTasks.id = "high";

    self.normalPriorityTasks = ko.observableArray([
        new Task("Try to trash this item")
    ]);
    self.highPriorityTasks.id = "normal";

    self.selectedTask = ko.observable();
    self.clearTask = function (data, event) {
        if (data === self.selectedTask()) {
            self.selectedTask(null);
        }

        if (data.name() === "") {
            self.highPriorityTasks.remove(data);
            self.normalPriorityTasks.remove(data);
        }
    };

    self.isTaskSelected = function (task) {
        return task === self.selectedTask();
    };

    self.addTask = function () {
        var task = new Task("new");
        self.selectedTask(task);
        self.normalPriorityTasks.push(task);
        //hideModal();
    };
    self.trash = ko.observableArray([]);
    self.trash.id = "trash";

    self.myDropCallback = function (arg) {
        if (console) {
            console.log("Moved '" + arg.item.name() + "' from " + arg.sourceParent.id + " (index: " + arg.sourceIndex + ") to " + arg.targetParent.id + " (index " + arg.targetIndex + ")");
        }
    };
}


function hideModal() {
    $('#addModal').modal('hide');
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