"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicOnUpdateReturnComponent() {
    var state = (0, mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    (0, mitosis_1.onUpdate)(function () {
        var controller = new AbortController();
        var signal = controller.signal;
        fetch('https://patrickjs.com/api/resource.json', { signal: signal })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            state.name = data.name;
        });
        return function () {
            if (!signal.aborted) {
                controller.abort();
            }
        };
    }, [state.name]);
    return <div>Hello! {state.name}</div>;
}
exports.default = MyBasicOnUpdateReturnComponent;
