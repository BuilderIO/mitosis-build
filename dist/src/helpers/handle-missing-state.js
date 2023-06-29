"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMissingState = void 0;
var get_state_used_1 = require("./get-state-used");
function handleMissingState(json) {
    var stateUsed = (0, get_state_used_1.getStateUsed)(json);
    Array.from(stateUsed).forEach(function (property) {
        if (!(property in json.state)) {
            json.state[property] = { code: 'null', type: 'property', propertyType: 'normal' };
        }
    });
}
exports.handleMissingState = handleMissingState;
