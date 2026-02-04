let list = document.getElementById('list')
let write = document.getElementById('write')
let add = document.getElementById('add')
let count = document.getElementById('count')
let complete = document.getElementById('complete')
let incomplete = document.getElementById('incomplete')

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function updateCount() {
    let boxes = list.querySelectorAll('input[type="checkbox"]');
    let completed = 0;

    boxes.forEach(box => {
        if (box.checked) completed++;
    });

    count.innerText = `Total Tasks: ${list.children.length}`;
    complete.innerText = `Completed: ${completed}`;
    incomplete.innerText = `Incomplete: ${list.children.length - completed}`;
}

function saveTasks() {
    let data = Array.from(list.children).map(li => ({
        text: li.querySelector('p').innerText,
        done: li.querySelector('input').checked
    }));
    localStorage.setItem("tasks", JSON.stringify(data));
}

function createTask(taskText, isDone = false) {
    let li = document.createElement('li');
    let box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isDone;

    let text = document.createElement('p');
    text.innerText = taskText;
    if (isDone) text.classList.add('done');

    let edit = document.createElement('button');
    edit.innerText = 'Edit';
    edit.classList.add('editBtn');

    let del = document.createElement('button');
    del.innerText = 'Delete';
    del.classList.add('delBtn');
    del.disabled = !isDone;
    del.style.backgroundColor = isDone ? 'rgb(98, 98, 244)' : 'grey';

    li.appendChild(box);
    li.appendChild(text);
    li.appendChild(edit);
    li.appendChild(del);
    list.appendChild(li);

    edit.addEventListener('click', () => {
        if (edit.innerText === 'Save') {
            edit.innerText = 'Edit';
            edit.style.backgroundColor = 'lightgreen';
            let input = text.querySelector('input');
            text.innerText = input.value;
            saveTasks();
        } else {
            edit.innerText = 'Save';
            edit.style.backgroundColor = 'orange';
            text.innerHTML = `<input type="text" value="${text.innerText}">`;
        }
    });

    box.addEventListener('change', () => {
        del.disabled = !box.checked;
        del.style.backgroundColor = box.checked ? 'rgb(98, 98, 244)' : 'grey';
        text.classList.toggle('done');
        saveTasks();
        updateCount();
    });

    del.addEventListener('click', () => {
        li.remove();
        saveTasks();
        updateCount();
    });

    updateCount();
}

add.addEventListener('click', (e) => {
    e.preventDefault();
    if (write.value.trim() === '') return;
    createTask(write.value);
    saveTasks();
    write.value = '';
});

tasks.forEach(task => {
    createTask(task.text, task.done);
});