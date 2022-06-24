"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targets = void 0;
var angular_1 = require("./generators/angular");
var builder_1 = require("./generators/builder");
var html_1 = require("./generators/html");
var mitosis_1 = require("./generators/mitosis");
var liquid_1 = require("./generators/liquid");
var react_1 = require("./generators/react");
var react_native_1 = require("./generators/react-native");
var solid_1 = require("./generators/solid");
var svelte_1 = require("./generators/svelte");
var swift_ui_1 = require("./generators/swift-ui");
var template_1 = require("./generators/template");
var vue_1 = require("./generators/vue");
var stencil_1 = require("./generators/stencil");
exports.targets = {
    angular: angular_1.componentToAngular,
    builder: builder_1.componentToBuilder,
    customElement: html_1.componentToCustomElement,
    html: html_1.componentToHtml,
    mitosis: mitosis_1.componentToMitosis,
    liquid: liquid_1.componentToLiquid,
    react: react_1.componentToReact,
    reactNative: react_native_1.componentToReactNative,
    solid: solid_1.componentToSolid,
    svelte: svelte_1.componentToSvelte,
    swift: swift_ui_1.componentToSwift,
    template: template_1.componentToTemplate,
    webcomponent: html_1.componentToCustomElement,
    vue: vue_1.componentToVue3,
    vue2: vue_1.componentToVue2,
    vue3: vue_1.componentToVue3,
    stencil: stencil_1.componentToStencil,
};
