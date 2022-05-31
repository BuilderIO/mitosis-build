"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValues = void 0;
var mitosis_1 = require("@builder.io/mitosis");
exports.defaultValues = {
    name: 'PatrickJS',
};
function OnInit(props) {
    var state = (0, mitosis_1.useState)({
        // name: props.name
        // name: defaultValues.name || props.name,
        name: '',
    });
    (0, mitosis_1.onInit)(function () {
        state.name = exports.defaultValues.name || props.name;
        console.log('set defaults with props');
    });
    return <div>Default name defined by parent {state.name}</div>;
}
exports.default = OnInit;
