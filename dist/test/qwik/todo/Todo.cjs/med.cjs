const component = require("@builder.io/qwik").component;
const createStore = require("@builder.io/qwik").createStore;
const h = require("@builder.io/qwik").h;
const qrl = require("@builder.io/qwik").qrl;
const useLexicalScope = require("@builder.io/qwik").useLexicalScope;


exports.__merge = function __merge(state,props,create){if(create === void 0){create = false;}for(var key in props){if(key.indexOf(':')==-1 && !key.startsWith('__')&& Object.prototype.hasOwnProperty.call(props,key)){state[key] = props[key];}}if(create && typeof __STATE__ == 'object' && props.serverStateId){Object.assign(state,__STATE__[props.serverStateId]);}return state;};
exports.Todo_onMount = (__props__) => {
  const __state__ = createStore({});
  const state = exports.__merge(__state__, __props__,true);
  ;
  return qrl("./med.js", "Todo_onRender", [__props__,__state__]);
};
exports.Todo = component(qrl("./med.js", "Todo_onMount", []));

exports.Todo_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = exports.__merge(__state__, __props__);
  ;
  return (
    h(
      "li",
      {
        class: `${props.todo.completed ? 'completed' : ''} ${state.editing ? 'editing' : ''}`
      },
      h(
        "div",
        {
          class: "view"
        },
        h(
          "input",
          {
            type: "checkbox",
            class: "toggle",
            checked: props.todo.completed,
            "on:click": qrl("./high.js", "Todo_onClick_0", [__props__, __state__])
          }
        ),
        h(
          "label",
          {
            "on:dblclick": qrl("./high.js", "Todo_onDblClick_1", [__props__, __state__])
          },
          props.todo.text
        ),
        h(
          "button",
          {
            class: "destroy",
            "on:click": qrl("./high.js", "Todo_onClick_2", [__props__, __state__])
          }
        )
      ),
      state.editing ?
        h(
          "input",
          {
            class: "edit",
            value: props.todo.text,
            "on:blur": qrl("./high.js", "Todo_onBlur_3", [__props__, __state__]),
            "on:keyup": qrl("./high.js", "Todo_onKeyUp_4", [__props__, __state__])
          }
        )
        : null
    )
  );
};
