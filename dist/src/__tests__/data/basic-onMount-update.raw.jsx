"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicOnMountUpdateComponent(props) {
    var state = (0, mitosis_1.useState)({
        name: 'PatrickJS',
        names: ['Steve', 'PatrickJS'],
    });
    (0, mitosis_1.onInit)(function () {
        state.name = 'PatrickJS onInit' + props.hi;
    });
    (0, mitosis_1.onMount)(function () {
        state.name = 'PatrickJS onMount' + props.bye;
    });
    return <div>Hello {state.name}</div>;
}
exports.default = MyBasicOnMountUpdateComponent;
