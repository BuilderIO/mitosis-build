"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function SectionStateComponent(props) {
    var state = (0, mitosis_1.useState)({
        max: 42,
        items: [42],
    });
    return (<mitosis_1.Show when={state.max}>
      <mitosis_1.For each={state.items}>
        {function (item) { return (<section {...props.attributes} style={{ maxWidth: item + state.max }}>
            {props.children}
          </section>); }}
      </mitosis_1.For>
    </mitosis_1.Show>);
}
exports.default = SectionStateComponent;
