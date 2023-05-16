"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targets = exports.builder = void 0;
var alpine_1 = require("./generators/alpine");
var angular_1 = require("./generators/angular");
var builder_1 = require("./generators/builder");
var html_1 = require("./generators/html");
var liquid_1 = require("./generators/liquid");
var lit_1 = require("./generators/lit");
var marko_1 = require("./generators/marko");
var mitosis_1 = require("./generators/mitosis");
var qwik_1 = require("./generators/qwik");
var react_1 = require("./generators/react");
var react_native_1 = require("./generators/react-native");
var rsc_1 = require("./generators/rsc");
var solid_1 = require("./generators/solid");
var stencil_1 = require("./generators/stencil");
var svelte_1 = require("./generators/svelte");
var swift_ui_1 = require("./generators/swift-ui");
var taro_1 = require("./generators/taro");
var template_1 = require("./generators/template");
var vue_1 = require("./generators/vue");
exports.builder = builder_1.componentToBuilder;
exports.targets = {
    alpine: alpine_1.componentToAlpine,
    angular: angular_1.componentToAngular,
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
    qwik: qwik_1.componentToQwik,
    marko: marko_1.componentToMarko,
    preact: react_1.componentToPreact,
    lit: lit_1.componentToLit,
    rsc: rsc_1.componentToRsc,
    taro: taro_1.componentToTaro,
};
