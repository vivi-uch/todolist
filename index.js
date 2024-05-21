const input = document.getElementById('input');
const addBtn = document.getElementById('add-btn');
const todoHtml = document.getElementById('todos');
const img = document.getElementById('blank-img');
const delete_All = document.querySelector(".delete-all");
let completeNum = document.getElementById("complete-num");
let pendingNum = document.getElementById("pending-num");
let completed = document.getElementById("completed");
let pending = document.getElementById("pending");
var theme = document.getElementById("icon");
let logBtn = document.getElementById("log-out");
let editing = false;
let selectedTodo = null;
let selectedIndex = -1;
let edit_date;

//LOCALSTORAGE WORKING PERFECTLY
let todoJson = JSON.parse(localStorage.getItem("todos")) || [];
//typeof(todoJson) is object.
//todoJson would be an array of todoitems from the local storage but if empty return an empty array hence the logial OR..


let dateMessage = "";


// Name section
function askForName() {
    let userName = prompt("Please enter your name:");
    if (userName) {
        localStorage.setItem("userName", userName);
        displayUserName(userName);
    }
}

function displayUserName(userName) {
    let nameElement = document.getElementById("name");
    if (nameElement) {
        nameElement.textContent = `Welcome, ${userName}!`;
    }
}

function checkUserName() {
    let userName = localStorage.getItem("userName");
    if (!userName) {
        askForName();
    } else {
        displayUserName(userName);
    }
}
//when refreshed this is activated, so that askForName won't be repeated
window.addEventListener("DOMContentLoaded", () => {
    checkUserName();
    showTodos();
});



// retrieves everything when browser is opened.
function gettodoHtml(todo, index){
    // <i class="fa-solid fa-circle-minus" style="color: #B197FC;"></i>
    //whatever the status of the is, would determine if the checkbox is to be checked or not.
    let checked = todo.status =="completed" ? "checked" : "";

    // if (todo.status === "completed" && todo.completed) {
    //   dateMessage = `Completed at ${todo.completed}`;
    // } else if (todo.edited) {
    //   dateMessage = `Edited at ${todo.edited}`;
    // } else {
    //   dateMessage = `Created on ${todoJson[index].pending}`;
    // }

    if(todo.edited){ //&& !editing
      dateMessage = `Edited at ${todo.edited}`;
      // editing = false;
    }
    else{
      if (todo.status === "completed" && todo.completed) {
        dateMessage = `Completed at ${todo.completed}`;
      }
      else {
        dateMessage = `Created on ${todoJson[index].pending}`;
      }
    }
    
    //index from 0,for distuiguishing them..
    return `
        <li class="todo-item">
          <div class="todo-content">
            <div class="todo">
              <div class="not-button">
                <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked} required>
                <div class="text-area">
                  <span class="${checked}">${todo.name}</span>
                </div>
              </div>
              <div class="button-area">
                <button class="edit-btn"  data-index="${index}" onclick="edit(this)">
                <i class="fa-solid fa-pen-to-square" style="color: #B197FC;"></i>
                </button>
                <button class="delete-btn" data-index="${index}" onclick="remove(this)">
                  <i class="fa-solid fa-trash" style="color: #B197FC;"></i>
                </button>
              </div>
            </div>
            <p class="created-date">${dateMessage}</p>
          </div>
        </li>
    `;
}

//Delete all..
function deleteAll() {
    const check = confirm("Are you sure ?");
    if(check){
        todoJson = [];
        localStorage.setItem("todos",JSON.stringify(todoJson));
        showTodos();

        //Now it is updating...
        pendingNum.textContent = 0;
        completeNum.textContent = 0;
        //can't use localstorage.clear() cos it also clears "Username"..
    }
}

function logout(){
  let check = confirm("Are you sure?");
  if(check){
    localStorage.clear();
    location.reload();
  }
}
function edit(button){
  let todoItem = button.closest('li');
  if(todoItem){
    let index = parseInt(button.dataset.index);

    let todo = todoJson[index];
    
    editing = true;
    input.value = todo.name;

    selectedTodo = todo;
    selectedIndex = index;

    // todo.name = input.value.trim();

    // let newname = prompt("Edit Todo:", todo.name);

    // todo.name = newname.trim();
    // input.addEventListener("keyup", e=>{ //  when enter key is pressed
    //   //assigning the trimmed(removing white spaces b4 and after) input of the user to the variable todo
    //   todo.name = input.value.trim();
    //   todoJson[index] = todo;
    //   localStorage.setItem("todos", JSON.stringify(todoJson));
    //   showTodos();
    // });
    // showTodos();
  }
}

function remove(button) {
    // Retrieve the parent <li> element containing the todo item
    let todoItem = button.closest('li');
    if (todoItem) {
        // Retrieve the index of the todo item from the data-index attribute of the delete button
        let dataIndex = button.dataset.index;
                    // or 
        // let dataIndex = button.getAttribute('data-index');
        let index = parseInt(dataIndex);

        // Remove from todoitem array
        todoJson.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todoJson));
    }
    showTodos();
}

// SEVENTH THING TO DO
// function updateStatus(todo){
//     let todoName = todo.parentElement.lastElementChild;
//     if(todo.checked){
//         todoName.classList.add("checked");
//         todoJson(todo.id).status = "completed";
//     }
//     else{
//         todoName.classList.remove("checked");
//     }
//     localStorage.setItem("todos", JSON.stringify(todoJson));
// }

//Checked ststus...
function updateStatus(checkbox) {
    let index = parseInt(checkbox.id);
    // if(checkbox.checked){
    //     status = "completed";
    // }
    // else{
    //     status = "pending";
    // }
    let status = checkbox.checked ? "completed" : "pending";
    updateStorageStatus(index, status);
    showTodos();
}

function updateStorageStatus(index, status) {
    if (todoJson[index]) {
        todoJson[index].status = status;

        if (status === "completed") {
          todoJson[index].completed = new Date().toLocaleString();
        } else {
          delete todoJson[index].completed;
          todoJson[index].pending = new Date().toLocaleString();
        }

        localStorage.setItem("todos", JSON.stringify(todoJson));
        showTodos();
    } else {
        console.error('Todo item not found in todoJson: ', index);
    }
}



// THIRD THING TO DO
//determine what shows, img or todos, completed and pending.
function hide(){
    if (img) {
        img.style.display = 'none';
    }
}
function show(){
    if (img) {
        img.style.display = 'block';
    }
}
function showTodos(){
    if(todoJson.length == 0){
        todoHtml.innerHTML = '';
        show();
    }
    else{
        let completedTodos = todoJson.filter(todo => todo.status === "completed");
        let pendingTodos = todoJson.filter(todo => todo.status === "pending");
        
        completeNum.textContent = completedTodos.length;
        pendingNum.textContent = pendingTodos.length;

        todoHtml.innerHTML = todoJson.map(gettodoHtml).join('');
        //join converts it to string, map implies the function gettodoHtml on the todoJson array.
        hide();
    }
}
function showCompletedTodos() {
    let completedTodos = todoJson.filter(todo => todo.status === "completed");
    completeNum.textContent = completedTodos.length;
    todoHtml.innerHTML = completedTodos.map(gettodoHtml).join('');
}
function showPendingTodos() {
    let pendingTodos = todoJson.filter(todo => todo.status === "pending");
    todoHtml.innerHTML = pendingTodos.map(gettodoHtml).join('');
    pendingNum.textContent = pendingTodos.length;
}


// add todo
function addTodos(todo){
    input.value = "";  //clears the input text after a todo has been added.
    // adds it to the beginning of the array

  //   let newTodo = {
  //     name: todo,
  //     status: "pending",
  //     pending: new Date().toLocaleString()  
  // };

    todoJson.unshift({name:todo,status:"pending",pending:new Date().toLocaleString()});

    // todoJson.unshift(newTodo);

    //adds to the end of the array
    //todoJson.push({name:todo,status:"pending"}); 
    
    localStorage.setItem("todos",JSON.stringify(todoJson));
    showTodos();
}

// update todo for editing...
function updateTodo(index, todo){
  let currentTodos = todoJson;

  currentTodos[index] = {...todo, name: input.value};
  
  localStorage.setItem("todos",JSON.stringify(currentTodos));
  input.value = "";  
  // edit_date = new Date().toLocaleString(); 
  todoJson[index].edited = new Date().toLocaleString();
  editing = false;
  showTodos();
}

                              // All event listeners
//enter key
input.addEventListener("keyup", e=>{ 
    let todo = input.value.trim();
    if(e.key == "Enter"){
      if(!todo){
        alert("Todo can't be empty!");
        return;
      }
      if(!editing){
        addTodos(todo);
      } else {
        updateTodo(selectedIndex, selectedTodo)
      }
    }
});

// add button
addBtn.addEventListener("click", ()=>{
    let todo = input.value.trim();
    if(!todo){
      alert("Todo can't be empty!");
      return;
    }
    if(!editing){
      addTodos(todo);
    } else {
      updateTodo(selectedIndex, selectedTodo)
    }
});

//log out button
logBtn.addEventListener("click", ()=>{
  logout();
});

//delete bttn
delete_All.addEventListener("click",()=>{
    deleteAll();
});

//complete bttn
completed.addEventListener("click", ()=>{
    showCompletedTodos();
});

//pending bttn
pending.addEventListener("click",()=>{
    showPendingTodos();
});


// darkmode or lightmode
theme.onclick = function(){
    let check = document.body.classList.toggle("dark_theme");
    if(document.body.classList.contains("dark_theme")){
        icon.src = "/images/sun.png";
    }
    else{
        icon.src = "/images/moon.png";
    }
}


// localStorage.clear();
// To clear all data from local storage or start again...
