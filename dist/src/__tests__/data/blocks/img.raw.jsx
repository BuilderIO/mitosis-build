"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@builder.io/mitosis");
var sdk_1 = require("@builder.io/sdk");
function ImgComponent(props) {
    return (<img style={{
            objectFit: props.backgroundSize || 'cover',
            objectPosition: props.backgroundPosition || 'center',
        }} {...props.attributes} key={(sdk_1.Builder.isEditing && props.imgSrc) || 'default-key'} alt={props.altText} src={props.imgSrc}/>);
}
exports.default = ImgComponent;
