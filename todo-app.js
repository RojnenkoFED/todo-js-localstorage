(function() {

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('keyup', (e) => {
      button.disabled = (e.target.value == ' ' || e.target.value == '') ? true : false;
    });

    return {
      form,
      input,
      button
    };
  }

  function createTodoList() {
    let appList = document.createElement('ul');
    appList.classList.add('list-group');
    return appList;
  }

  function createTodoItem(name, done = false) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    if (done) {
      item.classList.add('list-group-item-success');
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
      name,
      done
    };
  }

  function doneButtonHandler(button, item, name, key, tasks) {
    button.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success');
      let state = (item.classList.contains('list-group-item-success')) ? true : false;
      let newTasks = tasks.map((task) => {
        if(task.name === name) {
          task.done = state;
        }
        return task;
      });

      updateLocalStorage(key, newTasks);
    });
  }

  function deleteButtonHandler(button, item, name, key) {
    button.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        let tasks = getTasksFromLocalStorage(key);
        let newTasks = tasks.filter((task) => task.name !== name);
        updateLocalStorage(key, newTasks);
        item.remove();
      }
    });
  }

  function renderTodoItem(elem, key, tasks) {
    doneButtonHandler(elem.doneButton, elem.item, elem.name, key, tasks);
    deleteButtonHandler(elem.deleteButton, elem.item, elem.name, key);
  }

  function updateLocalStorage(key, tasks) {
    localStorage.setItem(key, JSON.stringify(tasks.map((task) => task)));
  }

  function getTasksFromLocalStorage(keyStorage) {
    let json = JSON.parse(localStorage.getItem(keyStorage));
    if (json && json.length !== 0) {
      return json;
    }
  }

  function createTodoApp(container, title = 'Список дел', keyStorage, defaultTasks = []) {

    let tasks = getTasksFromLocalStorage(keyStorage) || defaultTasks || [];
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    tasks.map((task) => {
      let { name, done } = task;
      let todoItem = createTodoItem(name, done);
      todoList.append(todoItem.item);

      renderTodoItem(todoItem, keyStorage, tasks);
      updateLocalStorage(keyStorage, tasks);
    });

    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let taskNames = tasks.map(task => task.name);
      if (taskNames.includes(todoItemForm.input.value)) {
        alert('Такая задача уже создана!');
        todoItemForm.input.value = '';
      } else {
        let todoItem = createTodoItem(todoItemForm.input.value);

        tasks.push({ id: tasks.length + 1, name: todoItem.name, done: todoItem.done });
        updateLocalStorage(keyStorage, tasks);

        todoList.append(todoItem.item);
        todoItemForm.input.value = '';
        renderTodoItem(todoItem, keyStorage, tasks);
      }
    });
  }

  window.createTodoApp = createTodoApp;
})();
