"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_VALUES = {
    name: 'Sami',
};
function ComponentWithTypes(props) {
    return <div> Hello {props.name || DEFAULT_VALUES.name}</div>;
}
exports.default = ComponentWithTypes;
