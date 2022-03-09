"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function Video(props) {
    var _a;
    return (<video {...props.attributes} style={__assign(__assign({ width: '100%', height: '100%' }, (_a = props.attributes) === null || _a === void 0 ? void 0 : _a.style), { objectFit: props.fit, objectPosition: props.position, 
            // Hack to get object fit to work as expected and
            // not have the video overflow
            borderRadius: 1 })} preload="none" key={props.video || 'no-src'} poster={props.posterImage} autoPlay={props.autoPlay} muted={props.muted} controls={props.controls} loop={props.loop}/>);
}
exports.default = Video;
