import { Todo, __merge } from "./med.js";

import { h, qrl, useLexicalScope } from "@builder.io/qwik";



export const Todos_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    <section class="main">
      { todosState.todos.length ?
        <input type="checkbox"
            class="toggle-all"
            checked={todosState.allCompleted}
            on:click={qrl("./high.js", "Todos_onClick_0", [__props__, __state__])}>
        </input>
        : null
      }
      <ul class="todo-list">
        { (todosState.todos || []).map((function(__value__) {
          var state = Object.assign({}, this, {todosItem: __value__ == null ? {} : __value__});
          return (<Todo todo={todo}>
          </Todo>
          );
        }).bind(state))
        }
      </ul>
    </section>
  );
};
