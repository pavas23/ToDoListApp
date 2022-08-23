var ToDoListApp = (function (){
    var tasks = [];
    var taskList = document.getElementById("list");
    var addTaskInput = document.getElementById("add");
    var tasksCounter = document.getElementById("tasks-counter");

    async function fetchToDos(){
        try{
        const url = "https://jsonplaceholder.typicode.com/todos";
        const data = await fetch(url); // as fetch returns a promise
        const json = await data.json(); // json returns a promise so use await
        tasks = json.slice(0,10);
        renderList();
        }
        catch(err){
            console.log(err);
            window.alert("Internal Servor Error occured !");
        }
    }

    function addTaskToDOM(task){
        var li = document.createElement("li");
        li.innerHTML = 
        `
            <input type = "checkbox" id = "${task.id}" class = "custom-checkbox" ${(task.completed)?"checked":""}>
            <label for = "${task.id}"">${task.title}</label>
            <i class="fa-solid fa-trash delete" data-id = "${task.id}" ></i>
        `
        taskList.append(li);
    }

    function renderList() {
        taskList.innerHTML = "";
        for(let i=0;i<tasks.length;i++){
            addTaskToDOM(tasks[i]);
        }
        tasksCounter.innerText = tasks.length;
    }

    function toggleTask(taskid) {
        tasks.map((task) =>{
            if(task.id === Number(taskid) ){
                if(task.completed == true){
                    task.completed = false;
                }
                else{
                    task.completed = true;
                }
            }
        });
        renderList();
        showNotification("Task toggled successfully");
        return;
    }

    function deleteTask(taskid) {
        var newTasks = tasks.filter((task) =>{
            return task.id !== Number(taskid);
        });
        tasks = newTasks;
        renderList();
        showNotification("Task deleted successfully");
    }

    function addTask(task) {
        if (task) {
            tasks.push(task);
            renderList();
            showNotification("Task added successfully");
        }
        else{
            showNotification("Task can not be added");
        }
    }

    function showNotification(title) {
        window.alert(title);
    }

    function handleInputKeypress(event) {
        if (event.key == "Enter") {
            const title = event.target.value;
            if (!title) {
                showNotification("Task cannot be empty");
                return;
            }
            const task = {
                title: title,
                id: Date.now(),
                completed: false,
            }
            event.target.value = "";
            addTask(task);
        }
    }

    function handleClick(event){
        if(event.target.tagName == "I"){
            var id = event.target.dataset.id;
            deleteTask(id);
        }
        else if(event.target.className == "custom-checkbox"){
            var id = event.target.id;
            toggleTask(id);
        }
    }

    function initializeApp(){
        fetchToDos();
        addTaskInput.addEventListener("keypress", handleInputKeypress);
        document.addEventListener("click",handleClick);
    }

    // when this function is called it will return this object basically we are making initialize function public so that it can be accessed outside the function context as well.
    return{
        initializeApp:initializeApp,
    }

})(); // IIFE


