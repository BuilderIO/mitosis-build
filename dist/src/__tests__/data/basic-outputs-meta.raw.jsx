"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
(0, mitosis_1.useMetadata)({
    outputs: ['onMessage', 'onEvent'],
});
function MyBasicOutputsComponent(props) {
    var state = (0, mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    (0, mitosis_1.onMount)(function () {
        props.onMessage(state.name);
        props.onEvent(props.message);
    });
    return <div></div>;
}
exports.default = MyBasicOutputsComponent;
