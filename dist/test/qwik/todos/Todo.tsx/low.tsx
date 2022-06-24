import { Todo } from "./med.js";
import { h, qrl } from "@builder.io/qwik";
export const Todos_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  return (
    <section class="main">
      {todosState.todos.length ? (
        <input
          class="toggle-all"
          type="checkbox"
          checked={todosState.allCompleted}
          onClickQrl={qrl("./high.js", "Todos_onClick_0", [state])}
        ></input>
      ) : null}
      <ul class="todo-list">
        {(todosState.todos || []).map(
          function (__value__) {
            var state = Object.assign({}, this, {
              todosItem: __value__ == null ? {} : __value__,
            });
            return <Todo todo={todo}></Todo>;
          }.bind(state)
        )}
      </ul>
    </section>
  );
};
