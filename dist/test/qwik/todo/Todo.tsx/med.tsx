import { componentQrl, h, qrl } from "@builder.io/qwik";
export const Todo_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  return (
    <li
      class={`${props.todo.completed ? "completed" : ""} ${
        state.editing ? "editing" : ""
      }`}
    >
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          checked={props.todo.completed}
          onClickQrl={qrl("./high.js", "Todo_onClick_0", [state])}
        ></input>
        <label onDblClickQrl={qrl("./high.js", "Todo_onDblClick_1", [state])}>
          {props.todo.text}
        </label>
        <button
          class="destroy"
          onClickQrl={qrl("./high.js", "Todo_onClick_2", [state])}
        ></button>
      </div>
      {state.editing ? (
        <input
          class="edit"
          value={props.todo.text}
          onBlurQrl={qrl("./high.js", "Todo_onBlur_3", [state])}
          onKeyUpQrl={qrl("./high.js", "Todo_onKeyUp_4", [state])}
        ></input>
      ) : null}
    </li>
  );
};
export const Todo = componentQrl<any, any>(qrl("./med.js", "Todo_onMount", []));
