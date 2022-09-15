"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var basic_boolean_attribute_component_raw_1 = __importDefault(require("./basic-boolean-attribute-component.raw"));
function MyBooleanAttribute(props) {
    return (<div>
      {props.children} {props.type}
      <basic_boolean_attribute_component_raw_1.default toggle/>
      <basic_boolean_attribute_component_raw_1.default toggle={true}/>
      <basic_boolean_attribute_component_raw_1.default list={null}/>
    </div>);
}
exports.default = MyBooleanAttribute;
