"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
(0, mitosis_1.useMetadata)({
    forwardRef: 'inputRef',
});
function MyBasicForwardRefComponent(props) {
    var state = (0, mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    return (<div>
      <input ref={props.inputRef} css={{
            color: 'red',
        }} value={state.name} onChange={function (event) { return (state.name = event.target.value); }}/>
    </div>);
}
exports.default = MyBasicForwardRefComponent;
