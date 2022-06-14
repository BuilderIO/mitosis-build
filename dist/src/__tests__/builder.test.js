"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dedent_1 = __importDefault(require("dedent"));
var fs = __importStar(require("fs"));
var builder_1 = require("../generators/builder");
var mitosis_1 = require("../generators/mitosis");
var html_1 = require("../generators/html");
var builder_2 = require("../parsers/builder");
var jsx_1 = require("../parsers/jsx");
var compile_away_builder_components_1 = require("../plugins/compile-away-builder-components");
var __1 = require("..");
/**
 * Load a file using nodejs resolution as a string.
 */
function fixture(path) {
    var localpath = require.resolve(path);
    return fs.readFileSync(localpath, { encoding: 'utf-8' });
}
var stamped = fixture('./data/blocks/stamped-io.raw');
var customCode = fixture('./data/blocks/custom-code.raw');
var embed = fixture('./data/blocks/embed.raw');
var image = fixture('./data/blocks/image.raw');
var columns = fixture('./data/blocks/columns.raw');
var lazyLoadSection = JSON.parse(fixture('./data/builder/lazy-load-section.json'));
var mitosisOptions = {
    format: 'legacy',
};
describe('Builder', function () {
    test('extractStateHook', function () {
        var code = "useState({ foo: 'bar' }); alert('hi');";
        expect((0, builder_2.extractStateHook)(code)).toEqual({
            code: "alert('hi');",
            state: { foo: 'bar' },
        });
        expect((0, builder_2.extractStateHook)(code)).toEqual({
            code: "alert('hi');",
            state: { foo: 'bar' },
        });
    });
    test('Stamped', function () {
        var component = (0, jsx_1.parseJsx)(stamped);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)()({ component: backToMitosis });
        expect(mitosis).toMatchSnapshot();
    });
    test('CustomCode', function () {
        var component = (0, jsx_1.parseJsx)(customCode);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)()({ component: backToMitosis });
        expect(mitosis).toMatchSnapshot();
    });
    test('Embed', function () {
        var component = (0, jsx_1.parseJsx)(embed);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)()({ component: backToMitosis });
        expect(mitosis).toMatchSnapshot();
    });
    test('Image', function () {
        var component = (0, jsx_1.parseJsx)(image);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)()({ component: backToMitosis });
        expect(mitosis).toMatchSnapshot();
    });
    test('Columns', function () {
        var component = (0, jsx_1.parseJsx)(columns);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)()({ component: backToMitosis });
        expect(mitosis).toMatchSnapshot();
    });
    test('Section', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = (0, builder_2.builderContentToMitosisComponent)(lazyLoadSection);
                    return [4 /*yield*/, (0, html_1.componentToHtml)({
                            plugins: [(0, compile_away_builder_components_1.compileAwayBuilderComponents)()],
                        })({ component: component })];
                case 1:
                    html = _a.sent();
                    expect(html).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('Regenerate Image', function () {
        var code = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      import { useStore } from \"@builder.io/mitosis\";\n      import { Image } from \"@components\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <div\n            css={{\n              padding: \"20px\",\n            }}\n          >\n            <Image\n              image=\"https://cdn.builder.io/api/v1/image/foobar\"\n              sizes=\"100vw\"\n              backgroundSize=\"contain\"\n              css={{\n                marignTop: \"50px\",\n                display: \"block\",\n              }}\n            />\n          </div>\n        );\n      }\n    "], ["\n      import { useStore } from \"@builder.io/mitosis\";\n      import { Image } from \"@components\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <div\n            css={{\n              padding: \"20px\",\n            }}\n          >\n            <Image\n              image=\"https://cdn.builder.io/api/v1/image/foobar\"\n              sizes=\"100vw\"\n              backgroundSize=\"contain\"\n              css={{\n                marignTop: \"50px\",\n                display: \"block\",\n              }}\n            />\n          </div>\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
        var react = (0, __1.componentToReact)({
            plugins: [(0, compile_away_builder_components_1.compileAwayBuilderComponents)()],
        })({ component: component });
        expect(react).toMatchSnapshot();
    });
    test('Regenerate Text', function () {
        var code = (0, dedent_1.default)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      import { useStore } from \"@builder.io/mitosis\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <div\n            css={{\n              padding: \"20px\",\n            }}\n          >\n            <h2\n              css={{\n                marginBottom: \"20px\",\n              }}\n            >\n              Hello!\n            </h2>\n          </div>\n        );\n      }\n    "], ["\n      import { useStore } from \"@builder.io/mitosis\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <div\n            css={{\n              padding: \"20px\",\n            }}\n          >\n            <h2\n              css={{\n                marginBottom: \"20px\",\n              }}\n            >\n              Hello!\n            </h2>\n          </div>\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
    });
    test('Regenerate loop', function () {
        var code = (0, dedent_1.default)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      import { useStore, For } from \"@builder.io/mitosis\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <For each={state.people}>\n            {(person, index) => (\n              <div\n                key={person}\n                css={{\n                  padding: \"10px 0\",\n                }}\n              >\n                <span>{person}</span>\n                <span>{index}</span>\n              </div>\n            )}\n          </For>\n        );\n      }\n    "], ["\n      import { useStore, For } from \"@builder.io/mitosis\";\n\n      export default function MyComponent(props) {\n        const state = useStore({ people: [\"Steve\", \"Sewell\"] });\n\n        return (\n          <For each={state.people}>\n            {(person, index) => (\n              <div\n                key={person}\n                css={{\n                  padding: \"10px 0\",\n                }}\n              >\n                <span>{person}</span>\n                <span>{index}</span>\n              </div>\n            )}\n          </For>\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
    });
    test('Regenerate custom Hero', function () {
        var code = (0, dedent_1.default)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      import { Hero } from \"@components\";\n\n      export default function MyComponent(props) {\n        return (\n          <Hero\n            title=\"Your Title Here\"\n            image=\"https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F52dcecf48f9c48cc8ddd8f81fec63236\"\n            buttonLink=\"https://example.com\"\n            buttonText=\"Click\"\n            height={400}\n            css={{\n              display: \"flex\",\n              flexDirection: \"column\",\n              alignItems: \"stretch\",\n              position: \"relative\",\n              flexShrink: \"0\",\n              boxSizing: \"border-box\",\n              marginTop: \"200px\",\n            }}\n          />\n        );\n      }\n    "], ["\n      import { Hero } from \"@components\";\n\n      export default function MyComponent(props) {\n        return (\n          <Hero\n            title=\"Your Title Here\"\n            image=\"https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F52dcecf48f9c48cc8ddd8f81fec63236\"\n            buttonLink=\"https://example.com\"\n            buttonText=\"Click\"\n            height={400}\n            css={{\n              display: \"flex\",\n              flexDirection: \"column\",\n              alignItems: \"stretch\",\n              position: \"relative\",\n              flexShrink: \"0\",\n              boxSizing: \"border-box\",\n              marginTop: \"200px\",\n            }}\n          />\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        expect(component).toMatchSnapshot();
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        expect(backToMitosis).toMatchSnapshot();
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
    });
    // TODO: fix divs and CoreFragment - need to find way to reproduce
    test.skip('Regenerate fragments', function () {
        var code = (0, dedent_1.default)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      export default function MyComponent(props) {\n        return (\n          <>\n            Hello world\n\n            <>\n              <Fragment>Hi</Fragment>\n            </>\n          </>\n        );\n      }\n    "], ["\n      export default function MyComponent(props) {\n        return (\n          <>\n            Hello world\n\n            <>\n              <Fragment>Hi</Fragment>\n            </>\n          </>\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        expect(component).toMatchSnapshot();
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        expect(builderJson).toMatchSnapshot();
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        expect(backToMitosis).toMatchSnapshot();
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
    });
    // TODO: get passing, don't add extra divs. or at least use spans instead so don't break layout
    test.skip('Regenerate span text', function () {
        var code = (0, dedent_1.default)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      export default function MyComponent(props) {\n        return (\n          <div\n            css={{\n              display: \"block\",\n            }}\n          >\n            Hi there\n            <span\n              css={{\n                color: \"red\",\n              }}\n            >\n              Hello world\n            </span>\n          </div>\n        );\n      }\n    "], ["\n      export default function MyComponent(props) {\n        return (\n          <div\n            css={{\n              display: \"block\",\n            }}\n          >\n            Hi there\n            <span\n              css={{\n                color: \"red\",\n              }}\n            >\n              Hello world\n            </span>\n          </div>\n        );\n      }\n    "])));
        var component = (0, jsx_1.parseJsx)(code);
        var builderJson = (0, builder_1.componentToBuilder)()({ component: component });
        var backToMitosis = (0, builder_2.builderContentToMitosisComponent)(builderJson);
        var mitosis = (0, mitosis_1.componentToMitosis)(mitosisOptions)({
            component: backToMitosis,
        });
        expect(mitosis.trim()).toEqual(code.trim());
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
