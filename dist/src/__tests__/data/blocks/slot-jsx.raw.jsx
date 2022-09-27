"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var content_slot_jsx_raw_1 = __importDefault(require("./content-slot-jsx.raw"));
function SlotCode(props) {
    return (<div>
      <content_slot_jsx_raw_1.default slotTesting={<div>Hello</div>}/>
    </div>);
}
exports.default = SlotCode;
