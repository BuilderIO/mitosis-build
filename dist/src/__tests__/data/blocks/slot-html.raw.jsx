"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
var content_slot_jsx_raw_1 = __importDefault(require("./content-slot-jsx.raw"));
function SlotCode(props) {
    return (<div>
      <content_slot_jsx_raw_1.default>
        <mitosis_1.Slot testing={<div>Hello</div>}></mitosis_1.Slot>
      </content_slot_jsx_raw_1.default>
    </div>);
}
exports.default = SlotCode;
