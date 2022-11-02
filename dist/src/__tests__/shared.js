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
exports.runTestsForTarget = exports.runTestsForJsx = void 0;
var jsx_1 = require("../parsers/jsx");
var getRawFile = function (path) { return require(path); };
var basicForShow = getRawFile('./data/basic-for-show.raw');
var basicBooleanAttribute = getRawFile('./data/basic-boolean-attribute.raw');
var basicOnMountUpdate = getRawFile('./data/basic-onMount-update.raw');
var basicContext = getRawFile('./data/basic-context.raw');
var basicOutputsMeta = getRawFile('./data/basic-outputs-meta.raw');
var basicOutputs = getRawFile('./data/basic-outputs.raw');
var subComponent = getRawFile('./data/sub-component.lite.jsx');
var componentWithContext = require('./data/context/component-with-context.lite');
var basic = getRawFile('./data/basic.raw');
var basicAttribute = getRawFile('./data/basic-attribute.raw.tsx');
var basicMitosis = getRawFile('./data/basic-custom-mitosis-package.raw');
var basicChildComponent = getRawFile('./data/basic-child-component.raw');
var basicFor = getRawFile('./data/basic-for.raw');
var basicRef = getRawFile('./data/basic-ref.raw');
var basicForwardRef = getRawFile('./data/basic-forwardRef.raw');
var basicForwardRefMetadata = getRawFile('./data/basic-forwardRef-metadata.raw');
var basicRefPrevious = getRawFile('./data/basic-ref-usePrevious.raw');
var basicRefAssignment = getRawFile('./data/basic-ref-assignment.raw');
var propsDestructure = getRawFile('./data/basic-props-destructure.raw');
var nestedStyles = getRawFile('./data/nested-styles.lite');
var preserveExportOrLocalStatement = getRawFile('./data/basic-preserve-export-or-local-statement.raw');
var propsType = getRawFile('./data/types/component-props-type.raw');
var propsInterface = getRawFile('./data/types/component-props-interface.raw');
var preserveTyping = getRawFile('./data/types/preserve-typing.raw');
var typeDependency = getRawFile('./data/types/type-dependency.raw');
var defaultProps = getRawFile('./data/default-props/default-props.raw');
var defaultPropsOutsideComponent = getRawFile('./data/default-props/default-props-outside-component.raw');
var classRaw = getRawFile('./data/styles/class.raw');
var className = getRawFile('./data/styles/className.raw');
var classAndClassName = getRawFile('./data/styles/class-and-className.raw');
var classState = getRawFile('./data/styles/classState.raw');
var useStyle = getRawFile('./data/styles/use-style.raw');
var useStyleOutsideComponent = getRawFile('./data/styles/use-style-outside-component.raw');
var useStyleAndCss = getRawFile('./data/styles/use-style-and-css.raw');
var button = getRawFile('./data/blocks/button.raw');
var classNameJsx = getRawFile('./data/blocks/classname-jsx.raw');
var columns = getRawFile('./data/blocks/columns.raw');
var contentSlotHtml = getRawFile('./data/blocks/content-slot-html.raw');
var contentSlotJsx = getRawFile('./data/blocks/content-slot-jsx.raw');
var customCode = getRawFile('./data/blocks/custom-code.raw');
var formBlock = getRawFile('./data/blocks/form.raw');
var image = getRawFile('./data/blocks/image.raw');
var imageState = getRawFile('./data/blocks/img-state.raw');
var img = getRawFile('./data/blocks/img.raw');
var inputBlock = getRawFile('./data/blocks/input.raw');
var multipleOnUpdate = getRawFile('./data/blocks/multiple-onUpdate.raw');
var multipleOnUpdateWithDeps = getRawFile('./data/blocks/multiple-onUpdateWithDeps.raw');
var onInit = getRawFile('./data/blocks/onInit.raw');
var onInitonMount = getRawFile('./data/blocks/onInit-onMount.raw');
var onMount = getRawFile('./data/blocks/onMount.raw');
var onUpdate = getRawFile('./data/blocks/onUpdate.raw');
var onUpdateWithDeps = getRawFile('./data/blocks/onUpdateWithDeps.raw');
var rawText = getRawFile('./data/blocks/raw-text.raw');
var section = getRawFile('./data/blocks/section.raw');
var sectionState = getRawFile('./data/blocks/section-state.raw');
var selectBlock = getRawFile('./data/blocks/select.raw');
var selfRefCompWChildren = getRawFile('./data/blocks/self-referencing-component-with-children.raw');
var selfRefComp = getRawFile('./data/blocks/self-referencing-component.raw');
var slotHtml = getRawFile('./data/blocks/slot-html.raw');
var slotJsx = getRawFile('./data/blocks/slot-jsx.raw');
var stamped = getRawFile('./data/blocks/stamped-io.raw');
var submitButtonBlock = getRawFile('./data/blocks/submit-button.raw');
var text = getRawFile('./data/blocks/text.raw');
var textarea = getRawFile('./data/blocks/textarea.raw');
var video = getRawFile('./data/blocks/video.raw');
var multipleSpreads = getRawFile('./data/spread/multiple-spreads.raw');
var spreadAttrs = getRawFile('./data/spread/spread-attrs.raw');
var spreadNestedProps = getRawFile('./data/spread/spread-nested-props.raw');
var spreadProps = getRawFile('./data/spread/spread-props.raw');
var builderRenderContent = getRawFile('./data/blocks/builder-render-content.raw');
var rootFragmentMultiNode = getRawFile('./data/blocks/root-fragment-multi-node.raw');
var renderContentExample = getRawFile('./data/render-content.raw');
var path = 'test-path';
var BASIC_TESTS = {
    Basic: basic,
    BasicAttribute: basicAttribute,
    BasicBooleanAttribute: basicBooleanAttribute,
    BasicRef: basicRef,
    BasicRefPrevious: basicRefPrevious,
    BasicRefAssignment: basicRefAssignment,
    BasicChildComponent: basicChildComponent,
    BasicFor: basicFor,
    Input: inputBlock,
    Submit: submitButtonBlock,
    Select: selectBlock,
    Button: button,
    Textarea: textarea,
    Img: img,
    Video: video,
    Section: section,
    Text: text,
    RawText: rawText,
    'Stamped.io': stamped,
    CustomCode: customCode,
    Embed: customCode,
    Image: image,
    Columns: columns,
    onUpdate: onUpdate,
    onInit: onInit,
    onUpdateWithDeps: onUpdateWithDeps,
    onMount: onMount,
    propsType: propsType,
    propsInterface: propsInterface,
    defaultProps: defaultProps,
    defaultPropsOutsideComponent: defaultPropsOutsideComponent,
    preserveTyping: preserveTyping,
    typeDependency: typeDependency,
    defaultValsWithTypes: getRawFile('./data/types/component-with-default-values-types.raw'),
    'import types': builderRenderContent,
    subComponent: subComponent,
    nestedStyles: nestedStyles,
    propsDestructure: propsDestructure,
    'onInit & onMount': onInitonMount,
    'Basic Context': basicContext,
    'Basic Outputs Meta': basicOutputsMeta,
    'Basic Outputs': basicOutputs,
    className: classNameJsx,
    'Image State': imageState,
    'Basic OnMount Update': basicOnMountUpdate,
    preserveExportOrLocalStatement: preserveExportOrLocalStatement,
    'class + css': classRaw,
    'className + css': className,
    'class + ClassName + css': classAndClassName,
    'use-style': useStyle,
    'use-style-and-css': useStyleAndCss,
    'use-style-outside-component': useStyleOutsideComponent,
    'self-referencing component with children': selfRefCompWChildren,
    'self-referencing component': selfRefComp,
    rootFragmentMultiNode: rootFragmentMultiNode,
    multipleSpreads: multipleSpreads,
    spreadAttrs: spreadAttrs,
    spreadNestedProps: spreadNestedProps,
    spreadProps: spreadProps,
    // renderContentExample,
};
var SLOTS_TESTS = {
    ContentSlotJSX: contentSlotJsx,
    ContentSlotHtml: contentSlotHtml,
    SlotJsx: slotJsx,
    SlotHtml: slotHtml,
    classState: classState,
};
var MULTI_ON_UPDATE_TESTS = {
    multipleOnUpdate: multipleOnUpdate,
    multipleOnUpdateWithDeps: multipleOnUpdateWithDeps,
};
var FORM_BLOCK_TESTS = {
    Form: formBlock,
};
var FOR_SHOW_TESTS = {
    Section: sectionState,
    Basic: basicForShow,
};
var FORWARD_REF_TESTS = {
    basicForwardRef: basicForwardRef,
    basicForwardRefMetadata: basicForwardRefMetadata,
};
var SHOW_TESTS = {
    rootShow: getRawFile('./data/blocks/rootShow.raw'),
    nestedShow: getRawFile('./data/show/nested-show.raw'),
    showWithFor: getRawFile('./data/show/show-with-for.raw'),
};
var ADVANCED_REF = {
    AdvancedRef: getRawFile('./data/advanced-ref.raw'),
};
var ON_UPDATE_RETURN = {
    basicOnUpdateReturn: getRawFile('./data/basic-onUpdate-return.raw'),
};
var IMPORT_TEST = {
    importRaw: getRawFile('./data/import.raw'),
};
var CONTEXT_TEST = {
    componentWithContext: componentWithContext,
};
var JSX_TESTS = [
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    FOR_SHOW_TESTS,
    CONTEXT_TEST,
];
var TESTS_FOR_TARGET = {
    react: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    rsc: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    angular: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        IMPORT_TEST,
    ],
    lit: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    marko: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    webcomponent: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FORM_BLOCK_TESTS
    ],
    vue: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    svelte: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    html: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FORM_BLOCK_TESTS
    ],
    stencil: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        // ROOT_SHOW_TESTS,
        FORWARD_REF_TESTS,
        // MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS
    ],
    solid: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        // FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    reactNative: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    liquid: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    qwik: [
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
    ],
};
var runTestsForJsx = function () {
    test('Remove Internal mitosis package', function () {
        var component = (0, jsx_1.parseJsx)(basicMitosis, {
            compileAwayPackages: ['@dummy/custom-mitosis'],
        });
        expect(component).toMatchSnapshot();
    });
    JSX_TESTS.forEach(function (tests) {
        Object.keys(tests).forEach(function (key) {
            test(key, function () {
                var component = (0, jsx_1.parseJsx)(tests[key]);
                expect(component).toMatchSnapshot();
            });
        });
    });
};
exports.runTestsForJsx = runTestsForJsx;
var runTestsForTarget = function (_a) {
    var target = _a.target, generator = _a.generator, options = _a.options;
    var testsArray = TESTS_FOR_TARGET[target];
    test('Remove Internal mitosis package', function () {
        var component = (0, jsx_1.parseJsx)(basicMitosis, {
            compileAwayPackages: ['@dummy/custom-mitosis'],
        });
        var output = generator(options)({ component: component, path: path });
        expect(output).toMatchSnapshot();
    });
    var configurations = [
        { options: __assign(__assign({}, options), { typescript: false }), testName: 'Javascript Test' },
        { options: __assign(__assign({}, options), { typescript: true }), testName: 'Typescript Test' },
    ];
    if (testsArray) {
        configurations.forEach(function (_a) {
            var options = _a.options, testName = _a.testName;
            describe(testName, function () {
                testsArray.forEach(function (tests) {
                    Object.keys(tests).forEach(function (key) {
                        test(key, function () {
                            var component = (0, jsx_1.parseJsx)(tests[key], { typescript: options.typescript });
                            var getOutput = function () { return generator(options)({ component: component, path: path }); };
                            try {
                                expect(getOutput()).toMatchSnapshot();
                            }
                            catch (error) {
                                expect(getOutput).toThrowErrorMatchingSnapshot();
                            }
                        });
                    });
                });
            });
        });
    }
};
exports.runTestsForTarget = runTestsForTarget;
