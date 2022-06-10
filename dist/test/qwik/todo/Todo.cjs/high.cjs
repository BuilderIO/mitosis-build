const useLexicalScope = require("@builder.io/qwik").useLexicalScope;
exports.Todo_onClick_0 = (event) => {
  const state = useLexicalScope()[0];
  state.toggle();
};
exports.Todo_onDblClick_1 = (event) => {
  const state = useLexicalScope()[0];
  state.editing = true;
};
exports.Todo_onClick_2 = (event) => {
  todosState.todos.splice(todosState.todos.indexOf(props.todo));
};
exports.Todo_onBlur_3 = (event) => {
  const state = useLexicalScope()[0];
  state.editing = false;
};
exports.Todo_onKeyUp_4 = (event) => {
  props.todo.text = event.target.value;
};
