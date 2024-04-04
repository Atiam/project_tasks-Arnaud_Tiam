// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
if(nextId === null){
    nextId = 1

}else{
    nextId++;

}
localStorage.setItem('nextId', JSON.stringify(nextId))

    return nextId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $(`<div>`)
    .addClass(`card task-card draggable my-3`)
    .attr(`data-task-id`, task.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.type);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr(`data-task-id`, task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  // Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
  // Return the card so it can be appended to the correct lane.
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    let toDoContainer = $(`#todo-cards`);
    let inProgressContainer = $(`#in-progress-cards`);
    let doneContainer = $(`#done-cards`);

// needs to run the createTaskCard function depending on how many tasks are in localStorage
if (!taskList){
    taskList = []
}
// create a forloop that will read the data from local storage and run  the create task card function
for (const task of taskList) {
    // Compaire the status to know what we are going to append thise cards to.
    if (task.status === 'to-do' ){
        toDoContainer.append(createTaskCard(task))

    }else if (task.status === 'in-progress' ){
        inProgressContainer.append(createTaskCard(task))
    }else {
        doneContainer.append(createTaskCard(task))
    }

}


  //JQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
     helper: function (e) {
    //     // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
         const original = $(e.target).hasClass('ui-draggable')
           ? $(e.target)
           : $(e.target).closest('.ui-draggable');
    //     // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
         return original.clone().css({
           width: original.outerWidth(),
         });
       },
     });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskNameInputEl = $("#task-name-input");
  const taskTypeInputEl = $("#task-type-input");
  const taskDateInputEl = $("#taskDueDate");
  //Read user input from the form
  const taskName = taskNameInputEl.val().trim();
  const taskType = taskTypeInputEl.val();
  const taskDate = taskDateInputEl.val();
 // We create newtask object with differents property. 
  const newtask = {
    id: generateTaskId(),
    name: taskName,
    type: taskType,
    dueDate: taskDate,
    status: "to-do",
  };

  // We push the contain of the newtask object into the tasklist array.
  taskList.push(newtask);

  // We save the updated projects array to localStorage
localStorage.setItem('tasks', JSON.stringify(taskList))

  //Print project data back to the screen
renderTaskList();

  //Clear the form inputs
  taskNameInputEl.val("");
  taskTypeInputEl.val("");
  taskDateInputEl.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr(`data-task-id`);
  
  //Remove project from the array. 
  taskList.forEach((task) => {
    if (task.id === taskId) {
      taskList.splice(taskList.indexOf(task), 1);
    }
  });

   //Here we use our other function to print projects back to the screen
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  //Read projects from localStorage
  // const task = readProjectsFromStorage();

  //Get the task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  //Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    //Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  //Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  // create an event listener for the form that runs the handleaddtask function
  const taskFormEl = $(`#task-form`);
  taskFormEl.on(`submit`, handleAddTask);


  // Make the due date field a date piker
  $( "#taskDueDate" ).datepicker({
    changeMonth: true,
    changeYear: true,
  });



});