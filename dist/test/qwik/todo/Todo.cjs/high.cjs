const __merge = require("./med.js").__merge;

const useEvent = require("@builder.io/qwik").useEvent;
const useLexicalScope = require("@builder.io/qwik").useLexicalScope;


exports.Todo_onClick_0 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.toggle();
};

exports.Todo_onDblClick_1 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.editing = true;
};

exports.Todo_onClick_2 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  todosState.todos.splice(todosState.todos.indexOf(props.todo));
};

exports.Todo_onBlur_3 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  
  state.editing = false;
};

exports.Todo_onKeyUp_4 = () => {
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

