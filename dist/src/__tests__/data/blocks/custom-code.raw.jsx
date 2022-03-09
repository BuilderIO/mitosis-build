"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function CustomCode(props) {
    var elem = (0, mitosis_1.useRef)();
    var state = (0, mitosis_1.useState)({
        scriptsInserted: [],
        scriptsRun: [],
        findAndRunScripts: function () {
            // TODO: Move this function to standalone one in '@builder.io/utils'
            if (elem && typeof window !== 'undefined') {
                /** @type {HTMLScriptElement[]} */
                var scripts = elem.getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {
                    var script = scripts[i];
                    if (script.src) {
                        if (state.scriptsInserted.includes(script.src)) {
                            continue;
                        }
                        state.scriptsInserted.push(script.src);
                        var newScript = document.createElement('script');
                        newScript.async = true;
                        newScript.src = script.src;
                        document.head.appendChild(newScript);
                    }
                    else if (!script.type ||
                        [
                            'text/javascript',
                            'application/javascript',
                            'application/ecmascript',
                        ].includes(script.type)) {
                        if (state.scriptsRun.includes(script.innerText)) {
                            continue;
                        }
                        try {
                            state.scriptsRun.push(script.innerText);
                            new Function(script.innerText)();
                        }
                        catch (error) {
                            console.warn('`CustomCode`: Error running script:', error);
                        }
                    }
                }
            }
        },
    });
    (0, mitosis_1.onMount)(function () {
        state.findAndRunScripts();
    });
    return (<div ref={elem} class={'builder-custom-code' + (props.replaceNodes ? ' replace-nodes' : '')} innerHTML={props.code}></div>);
}
exports.default = CustomCode;
