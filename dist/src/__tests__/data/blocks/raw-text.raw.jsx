"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function RawText(props) {
    var _a, _b;
    return (<span class={((_a = props.attributes) === null || _a === void 0 ? void 0 : _a.class) || ((_b = props.attributes) === null || _b === void 0 ? void 0 : _b.className)} innerHTML={props.text || ''}/>);
}
exports.default = RawText;
