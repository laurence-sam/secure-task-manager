const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCountEl = document.getElementById('totalCount');
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');

let taskCounter = 0;

function createTaskElement(taskText, taskId) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = taskId;
    li.dataset.state = 'pending';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
}

function addTask(taskText) {
    const trimmed = taskText.trim();
    if (!trimmed) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }
    taskMessage.textContent = '';
    taskCounter++;
    const taskId = `task-${taskCounter}`;
    const taskEl = createTaskElement(trimmed, taskId);
    taskList.appendChild(taskEl);
    taskInput.value = '';
    updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle('completed');
    taskItem.dataset.state = taskItem.classList.contains('completed') ? 'completed' : 'pending';
    updateTaskCounts();
}

function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector('.task-text');
    const currentText = textSpan.textContent;

    const input = document.createElement('input');
    input.className = 'edit-input';
    input.type = 'text';
    input.value = currentText;

    taskItem.replaceChild(input, textSpan);

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.textContent = 'Save';
}

function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector('.edit-input');
    const newText = input.value.trim();

    if (!newText) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }
    taskMessage.textContent = '';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = newText;

    taskItem.replaceChild(span, input);

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.textContent = 'Edit';
}

function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const allTasks = taskList.querySelectorAll('.task-item');
    const total = allTasks.length;
    let completed = 0;

    allTasks.forEach(task => {
        if (task.dataset.state === 'completed') {
            completed++;
        }
    });

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = total - completed;
}

function handleTaskListClick(event) {
    const target = event.target;

    if (!target.matches('.complete-btn, .edit-btn, .remove-btn')) return;

    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    if (target.classList.contains('complete-btn')) {
        toggleTaskComplete(taskItem);
    } else if (target.classList.contains('edit-btn')) {
        if (taskItem.querySelector('.edit-input')) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (target.classList.contains('remove-btn')) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    const samples = [
        'Review DOM selectors',
        'Practice createElement',
        'Study event delegation'
    ];

    const fragment = document.createDocumentFragment();

    samples.forEach(text => {
        taskCounter++;
        const taskId = `task-${taskCounter}`;
        fragment.appendChild(createTaskElement(text, taskId));
    });

    taskList.appendChild(fragment);
    updateTaskCounts();
}

addTaskBtn.addEventListener('click', () => {
    addTask(taskInput.value);
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask(taskInput.value);
});

loadSamplesBtn.addEventListener('click', loadSampleTasks);

taskList.addEventListener('click', handleTaskListClick);