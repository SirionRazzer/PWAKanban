// Check that service workers are registered
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/PWAKanban/sw.js");
  });
}

function hide(el) {
    el.style.display = 'none';
    return el;
}

function show(el) {
    el.style.display = 'block';
    return el;
}

function setSyncForm() {
    if (localStorage.getItem("hasSyncedBoard")) {
        console.log("hide setup");
        hide(document.getElementById('noSyncedBoardOptions'));
        show(document.getElementById('syncedBoardOptions'));
        document.getElementById('boardId').innerHTML = localStorage.getItem("boardId");
    } else {
        console.log("show setup");
        show(document.getElementById('noSyncedBoardOptions'));
        hide(document.getElementById('syncedBoardOptions'));
    }
}
setSyncForm();

var savingLocked = true;

var synchronizeStarted = false;
var synchronizeDelay;

function startSynchronizeDelay() {
    if (!synchronizeStarted) {
        synchronizeStarted = true;
        console.log("startSynchronizeDelay");
        synchronizeDelay = setTimeout(synchronize, 1000);
    }
}
function resetSynchronizeDelay() {
    clearTimeout(synchronizeDelay);
    synchronizeStarted = false;
    startSynchronizeDelay();
}

var Task = function (name) {
  this.name = ko.observable(name);
    this.name.subscribe(function () {
    model.save();
  });
};

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

      localStorage.setItem("todoTasks", todoTasks);
      localStorage.setItem("doingTasks", doingTasks);
      localStorage.setItem("doneTasks", doneTasks);

            localStorage.setItem("changeTime", new Date());
            startSynchronizeDelay();
            resetSynchronizeDelay();
    }
  };
  //self.listName = ko.observable();
  self.todoTasks = ko.observableArray([]);
  self.todoTasks.id = "todo";
    self.todoTasks.subscribe(function () {
    self.save();
  });

  self.doingTasks = ko.observableArray([]);
  self.doingTasks.id = "doing";
    self.doingTasks.subscribe(function () {
    self.save();
  });

  self.doneTasks = ko.observableArray([]);
  self.doingTasks.id = "done";
    self.doneTasks.subscribe(function () {
    self.save();
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
        localStorage.setItem("changeTime", new Date());
        startSynchronizeDelay();
        resetSynchronizeDelay();
  };

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
        console.log("restore");
    var todoTasksJSON = localStorage.getItem("todoTasks");
    var doingTasksJSON = localStorage.getItem("doingTasks");
    var doneTasksJSON = localStorage.getItem("doneTasks");

    if (
      todoTasksJSON != null &&
      doingTasksJSON != null &&
      doneTasksJSON != null
    ) {
            var todoTasks = $.map(JSON.parse(todoTasksJSON).tasks, function (item) {
        return new Task(item.name);
      });
      self.todoTasks(todoTasks);

            var doingTasks = $.map(JSON.parse(doingTasksJSON).tasks, function (item) {
        return new Task(item.name);
      });
      self.doingTasks(doingTasks);

            var doneTasks = $.map(JSON.parse(doneTasksJSON).tasks, function (item) {
        return new Task(item.name);
      });
      self.doneTasks(doneTasks);
    }

    savingLocked = false;
  };

  self.trash = ko.observableArray([]);
  self.trash.id = "trash";

    self.myDropCallback = function (arg) {
    if (console) {
            // console.log(
            //     "Moved '" +
            //     arg.item.name() +
            //     "' from " +
            //     arg.sourceParent.id +
            //     " (index: " +
            //     arg.sourceIndex +
            //     ") to " +
            //     arg.targetParent.id +
            //     " (index " +
            //     arg.targetIndex +
            //     ")"
            // );
    }
  };
};

//control visibility, give element focus, and select the contents (in order)
ko.bindingHandlers.visibleAndSelect = {
    update: function (element, valueAccessor) {
    ko.bindingHandlers.visible.update(element, valueAccessor);
    if (valueAccessor()) {
            setTimeout(function () {
        $(element)
          .find("input")
          .focus()
          .select();
      }, 0); //new tasks are not in DOM yet
    }
  }
};

var localStorage = window.localStorage;

function clearLocalStorageAndRefresh() {
    localStorage.removeItem("todoTasks");
    localStorage.removeItem("doingTasks");
    localStorage.removeItem("doneTasks");
  model.clear();
    synchronize();
}

var model = new ViewModel();
ko.applyBindings(model);
model.restore();

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDYh4b4BaNQTGfm2DjD0kOGcgaTgBYxUgA",
  authDomain: "pwakanban.firebaseapp.com",
  databaseURL: "https://pwakanban.firebaseio.com",
  projectId: "pwakanban",
  storageBucket: "",
  messagingSenderId: "257149002759",
  appId: "1:257149002759:web:af3f4290a6ba6c1f"
};
// Initialize Firebase
firebase = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const showSyncedBoardId = function () {
}

const createSyncedBoard = function () {
    if (!localStorage.getItem("hasSyncedBoard")) {
        let changeTime = new Date();
        db.collection("boards").add({
            changeTime: changeTime,
            todoTasks: localStorage.getItem("todoTasks"),
            doingTasks: localStorage.getItem("doingTasks"),
            doneTasks: localStorage.getItem("doneTasks")
        })
            .then(function (docRef) {
                localStorage.setItem("changeTime", new Date());
                localStorage.setItem("hasSyncedBoard", "true");
                localStorage.setItem("boardId", docRef.id);
                synchronize();
                setSyncForm();
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
}

const loadSyncedBoard = function (boardId) {
    var boardId = document.getElementById('inBoardId').value;
    console.log(`loadSynced ${boardId}`);
    if (!localStorage.getItem("hasSyncedBoard" && boardId)) {
        let docRef = db.collection("boards").doc(boardId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                localStorage.setItem("changeTime", doc.data().changeTime);
                localStorage.setItem("todoTasks", doc.data().todoTasks);
                localStorage.setItem("doingTasks", doc.data().doingTasks);
                localStorage.setItem("doneTasks", doc.data().doneTasks);
                localStorage.setItem("boardId", boardId);
                localStorage.setItem("hasSyncedBoard", "true");
                showSyncedBoardId();
                model.restore();
                setSyncForm();
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

const removeSyncedBoard = function () {
    if (localStorage.getItem("hasSyncedBoard")) {
        db.collection("boards").doc(localStorage.getItem("boardId")).delete().then(function () {
            localStorage.removeItem("boardId");
            localStorage.removeItem("hasSyncedBoard");
            localStorage.removeItem("changeTime");
            clearLocalStorageAndRefresh();
            showSyncedBoardId();
            model.restore();
            setSyncForm();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }
}

const synchronize = function () {
    console.log("synchronize");
    if (localStorage.getItem("hasSyncedBoard") && localStorage.getItem("boardId")) {
        // load remote date
        let boardId = localStorage.getItem("boardId");
        let docRef = db.collection("boards").doc(boardId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                let remotechangeTime = doc.data().changeTime;
                // select strategy based on dates
                // push if local newer then remote
                // pull if remote newer then local
                if (remotechangeTime.toDate() > new Date(localStorage.getItem("changeTime"))) {
                    pullSyncedBoard();
                }
                if (remotechangeTime.toDate() < new Date(localStorage.getItem("changeTime"))) {
                    pushSyncedBoard();
                }
            } else {
                pushSyncedBoard();
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        synchronizeStarted = false;
    }
    synchronizeStarted = false;
}

const pullSyncedBoard = function () {
    console.log("pull");
    if (localStorage.getItem("hasSyncedBoard") && localStorage.getItem("boardId")) {
        let boardId = localStorage.getItem("boardId");
        let docRef = db.collection("boards").doc(boardId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                localStorage.setItem("changeTime", doc.data().changeTime.toDate());
                localStorage.setItem("todoTasks", doc.data().todoTasks);
                localStorage.setItem("doingTasks", doc.data().doingTasks);
                localStorage.setItem("doneTasks", doc.data().doneTasks);
                model.restore();
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

const pushSyncedBoard = function () {
    console.log("push");
    let changeTime = new Date();
    if (localStorage.getItem("hasSyncedBoard") && localStorage.getItem("boardId")) {
        let boardId = localStorage.getItem("boardId");
        db.collection("boards").doc(boardId).set({
            changeTime: changeTime,
            todoTasks: localStorage.getItem("todoTasks"),
            doingTasks: localStorage.getItem("doingTasks"),
            doneTasks: localStorage.getItem("doneTasks")
        })
            .then(function () {
                localStorage.setItem("changeTime", changeTime);
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }
}

window.addEventListener("load", function () {
    synchronize();
});