import { __merge } from "./med.js";

import { useLexicalScope } from "@builder.io/qwik";


export const Todos_onClick_0 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  const newValue = !todosState.allCompleted;

  for (const todoItem of todosState.todos) {
    todoItem.completed = newValue;
  }
};

