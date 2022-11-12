"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHtmlNode = exports.parseHtml = void 0;
var compiler_1 = require("svelte/compiler");
var each_1 = require("./each");
var element_1 = require("./element");
var fragment_1 = require("./fragment");
var if_else_1 = require("./if-else");
var mustache_tag_1 = require("./mustache-tag");
var slot_1 = require("./slot");
var text_1 = require("./text");
function parseHtml(ast, json) {
    var _a, _b;
    // todo: should filter children and check if just 1 has length
    var html = ((_a = ast.html.children) === null || _a === void 0 ? void 0 : _a.length) === 2 && ((_b = ast.html.children[0].raw) === null || _b === void 0 ? void 0 : _b.trim().length) === 0
        ? ast.html.children[1]
        : ast.html;
    (0, compiler_1.walk)(html, {
        enter: function (node, parent) {
            var templateNode = node;
            var parentTemplateNode = parent;
            if ((parentTemplateNode === null || parentTemplateNode === void 0 ? void 0 : parentTemplateNode.children) || templateNode.data === '\n\n') {
                this.skip();
                return;
            }
            var mitosisNode = parseHtmlNode(json, templateNode);
            if (mitosisNode) {
                json.children.push(mitosisNode);
            }
        },
    });
}
exports.parseHtml = parseHtml;
function parseHtmlNode(json, node) {
    var mitosisNode = {
        '@type': '@builder.io/mitosis/node',
        name: '',
        meta: {},
        scope: {},
        children: [],
        bindings: {},
        properties: {},
    };
    switch (node.type) {
        case 'Element':
        case 'InlineComponent': {
            return (0, element_1.parseElement)(json, node);
        }
        case 'MustacheTag': {
            return (0, mustache_tag_1.parseMustacheTag)(node);
        }
        case 'RawMustacheTag': {
            return (0, mustache_tag_1.parseRawMustacheTag)(node);
        }
        case 'IfBlock': {
            return (0, if_else_1.parseIfElse)(json, node);
        }
        case 'EachBlock': {
            return (0, each_1.parseEach)(json, node);
        }
        case 'Text': {
            return (0, text_1.parseText)(node);
        }
        case 'Fragment': {
            return (0, fragment_1.parseFragment)(json, node);
        }
        case 'Slot': {
            return (0, slot_1.parseSlot)(json, node);
        }
        case 'Comment': {
            // do nothing :) probably skip?
            break;
        }
        default: {
            mitosisNode.name = 'div';
        }
    }
}
exports.parseHtmlNode = parseHtmlNode;
