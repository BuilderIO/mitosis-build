"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@builder.io/mitosis");
var sdk_1 = require("@builder.io/sdk");
function FormInputComponent(props) {
    return (<input {...props.attributes} key={sdk_1.Builder.isEditing && props.defaultValue ? props.defaultValue : 'default-key'} placeholder={props.placeholder} type={props.type} name={props.name} value={props.value} defaultValue={props.defaultValue} required={props.required}/>);
}
exports.default = FormInputComponent;
