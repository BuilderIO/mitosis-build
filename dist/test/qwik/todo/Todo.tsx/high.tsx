import { useLexicalScope } from "@builder.io/qwik";
export const Todo_onClick_0 = (event) => {
  const state = useLexicalScope()[0];
  state.toggle();
};
export const Todo_onDblClick_1 = (event) => {
  const state = useLexicalScope()[0];
  state.editing = true;
};
export const Todo_onClick_2 = (event) => {
  todosState.todos.splice(todosState.todos.indexOf(props.todo));
};
export const Todo_onBlur_3 = (event) => {
  const state = useLexicalScope()[0];
  state.editing = false;
};
export const Todo_onKeyUp_4 = (event) => {
  props.todo.text = event.target.value;
};
