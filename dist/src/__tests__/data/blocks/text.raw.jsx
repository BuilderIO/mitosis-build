"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("@builder.io/sdk");
var mitosis_1 = require("@builder.io/mitosis");
function Text(props) {
    var _a, _b, _c, _d, _e, _f;
    var allowEditingText = sdk_1.Builder.isBrowser &&
        sdk_1.Builder.isEditing &&
        location.search.includes('builder.allowTextEdit=true') &&
        !(((_b = (_a = props.builderBlock) === null || _a === void 0 ? void 0 : _a.bindings) === null || _b === void 0 ? void 0 : _b['component.options.text']) ||
            ((_d = (_c = props.builderBlock) === null || _c === void 0 ? void 0 : _c.bindings) === null || _d === void 0 ? void 0 : _d['options.text']) ||
            ((_f = (_e = props.builderBlock) === null || _e === void 0 ? void 0 : _e.bindings) === null || _f === void 0 ? void 0 : _f['text']));
    var state = (0, mitosis_1.useStore)({ name: 'Decadef20' });
    // TODO: Add back dynamic `direction` CSS prop when we add support for some
    //       sort of dynamic CSS
    // css={{ direction: props.rtlMode ? 'rtl' : 'ltr' }}
    return (<div contentEditable={allowEditingText || undefined} data-name={{ test: state.name || 'any name' }} innerHTML={props.text ||
            props.content ||
            state.name ||
            '<p class="text-lg">my name</p>'}/>);
}
exports.default = Text;
