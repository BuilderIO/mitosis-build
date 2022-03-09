import { __merge } from "./med.js";

import { useEvent, useLexicalScope } from "@builder.io/qwik";


export const Todo_onClick_0 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.toggle();
};

export const Todo_onDblClick_1 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.editing = true;
};

export const Todo_onClick_2 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  todosState.todos.splice(todosState.todos.indexOf(props.todo));
};

export const Todo_onBlur_3 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.editing = false;
};

export const Todo_onKeyUp_4 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  {
    const event = useEvent();
    props.todo.text = event.target.value
  }
};

