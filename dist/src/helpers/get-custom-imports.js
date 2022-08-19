"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomImports = void 0;
var is_upper_case_1 = require("./is-upper-case");
/**
 * Return custom imports of basic values (aka things
 * that are not ClassCase like components and types)
 *
 * For for code like:
 *   import { foo, bar } from './constants'
 *
 * Will return:
 *   ['foo', 'bar' ]
 *
 * This also filters for strings that appears to be actually used
 * by the template
 */
function getCustomImports(json) {
    var blocksString = JSON.stringify(json.children);
    var customImports = json.imports
        .map(function (item) {
        return Object.keys(item.imports).filter(function (item) {
            return item &&
                // this ignores component imports, which are CamelCased.
                (!(0, is_upper_case_1.isUpperCase)(item[0]) ||
                    // this includes constants which are typically CAPITALIZED.
                    item.toUpperCase() === item);
        });
    })
        .flat()
        // This is imperfect. Basically, if the string of this import name
        // doesn't occur at all, it's definitely not used. If it does, it might.
        // So this simple check helps us ~90% of the time not over-add imports
        // to templates. Arguably "good enough" for now, as there is generally no
        // consequence to over adding here, and it would be a lot more performance expensive
        // during compilation to do a complete AST parse and look for real references
        .filter(function (item) { return blocksString.includes(item); });
    return customImports;
}
exports.getCustomImports = getCustomImports;
