"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyComponent(props) {
    return (<div>
      {props.name}
      {props.children}
      <mitosis_1.Show when={props.name === 'Batman'}>
        <MyComponent name={'Bruce'}>
          <div>Wayne</div>
        </MyComponent>
      </mitosis_1.Show>
    </div>);
}
exports.default = MyComponent;
