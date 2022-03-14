"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
var sdk_1 = require("@builder.io/sdk");
function SelectComponent(props) {
    return (<select {...props.attributes} value={props.value} key={sdk_1.Builder.isEditing && props.defaultValue
            ? props.defaultValue
            : 'default-key'} defaultValue={props.defaultValue} name={props.name}>
      <mitosis_1.For each={props.options}>
        {function (option, index) { return (<option value={option.value} data-index={index}>
            {option.name || option.value}
          </option>); }}
      </mitosis_1.For>
    </select>);
}
exports.default = SelectComponent;
