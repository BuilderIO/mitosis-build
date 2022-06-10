export const Todos_onClick_0 = (event) => {
  const newValue = !todosState.allCompleted;

  for (const todoItem of todosState.todos) {
    todoItem.completed = newValue;
  }
};
