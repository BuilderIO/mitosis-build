"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@builder.io/mitosis");
function SectionComponent(props) {
    return (<section {...props.attributes} style={props.maxWidth && typeof props.maxWidth === 'number'
            ? { maxWidth: props.maxWidth }
            : undefined}>
      {props.children}
    </section>);
}
exports.default = SectionComponent;
