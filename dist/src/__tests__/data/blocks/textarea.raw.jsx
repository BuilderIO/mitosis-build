"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Textarea(props) {
    return (<textarea {...props.attributes} placeholder={props.placeholder} name={props.name} value={props.value} defaultValue={props.defaultValue}/>);
}
exports.default = Textarea;
