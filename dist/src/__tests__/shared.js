"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestsForTarget = exports.runTestsForJsx = void 0;
var jsx_1 = require("../parsers/jsx");
var basicForShow = require('./data/basic-for-show.raw');
var basicOnMountUpdate = require('./data/basic-onMount-update.raw');
var basicContext = require('./data/basic-context.raw');
var basicOutputsMeta = require('./data/basic-outputs-meta.raw');
var basicOutputs = require('./data/basic-outputs.raw');
var subComponent = require('./data/sub-component.lite.jsx');
var basic = require('./data/basic.raw');
var basicMitosis = require('./data/basic-custom-mitosis-package.raw');
var basicChildComponent = require('./data/basic-child-component.raw');
var basicFor = require('./data/basic-for.raw');
var basicRef = require('./data/basic-ref.raw');
var basicForwardRef = require('./data/basic-forwardRef.raw');
var basicForwardRefMetadata = require('./data/basic-forwardRef-metadata.raw');
var basicRefPrevious = require('./data/basic-ref-usePrevious.raw');
var basicRefAssignment = require('./data/basic-ref-assignment.raw');
var propsDestructure = require('./data/basic-props-destructure.raw');
var nestedStyles = require('./data/nested-styles.lite');
var preserveExportOrLocalStatement = require('./data/basic-preserve-export-or-local-statement.raw');
var propsType = require('./data/types/component-props-type.raw');
var propsInterface = require('./data/types/component-props-interface.raw');
var preserveTyping = require('./data/types/preserve-typing.raw');
var typeDependency = require('./data/types/type-dependency.raw');
var defaultProps = require('./data/default-props/default-props.raw');
var classRaw = require('./data/styles/class.raw');
var className = require('./data/styles/className.raw');
var classAndClassName = require('./data/styles/class-and-className.raw');
var classState = require('./data/styles/classState.raw');
var button = require('./data/blocks/button.raw');
var classNameJsx = require('./data/blocks/classname-jsx.raw');
var columns = require('./data/blocks/columns.raw');
var contentSlotHtml = require('./data/blocks/content-slot-html.raw');
var contentSlotJsx = require('./data/blocks/content-slot-jsx.raw');
var customCode = require('./data/blocks/custom-code.raw');
var formBlock = require('./data/blocks/form.raw');
var image = require('./data/blocks/image.raw');
var imageState = require('./data/blocks/img-state.raw');
var img = require('./data/blocks/img.raw');
var inputBlock = require('./data/blocks/input.raw');
var multipleOnUpdate = require('./data/blocks/multiple-onUpdate.raw');
var multipleOnUpdateWithDeps = require('./data/blocks/multiple-onUpdateWithDeps.raw');
var onInit = require('./data/blocks/onInit.raw');
var onInitonMount = require('./data/blocks/onInit-onMount.raw');
var onMount = require('./data/blocks/onMount.raw');
var onUpdate = require('./data/blocks/onUpdate.raw');
var onUpdateWithDeps = require('./data/blocks/onUpdateWithDeps.raw');
var rawText = require('./data/blocks/raw-text.raw');
var section = require('./data/blocks/section.raw');
var sectionState = require('./data/blocks/section-state.raw');
var selectBlock = require('./data/blocks/select.raw');
var selfRefCompWChildren = require('./data/blocks/self-referencing-component-with-children.raw');
var selfRefComp = require('./data/blocks/self-referencing-component.raw');
var slotHtml = require('./data/blocks/slot-html.raw');
var slotJsx = require('./data/blocks/slot-jsx.raw');
var stamped = require('./data/blocks/stamped-io.raw');
var submitButtonBlock = require('./data/blocks/submit-button.raw');
var text = require('./data/blocks/text.raw');
var textarea = require('./data/blocks/textarea.raw');
var video = require('./data/blocks/video.raw');
var path = 'test-path';
var BASIC_TESTS = {
    Basic: basic,
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
    preserveTyping: preserveTyping,
    typeDependency: typeDependency,
    defaultValsWithTypes: require('./data/types/component-with-default-values-types.raw'),
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
    'self-referencing component with children': selfRefCompWChildren,
    'self-referencing component': selfRefComp,
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
    rootShow: require('./data/blocks/rootShow.raw'),
    nestedShow: require('./data/show/nested-show.raw'),
    showWithFor: require('./data/show/show-with-for.raw'),
};
var ADVANCED_REF = {
    AdvancedRef: require('./data/advanced-ref.raw'),
};
var ON_UPDATE_RETURN = {
    basicOnUpdateReturn: require('./data/basic-onUpdate-return.raw'),
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
];
var TESTS_FOR_TARGET = {
    react: [
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
    lit: [
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
var runTestsForTarget = function (target, generator) {
    var testsArray = TESTS_FOR_TARGET[target];
    test('Remove Internal mitosis package', function () {
        var component = (0, jsx_1.parseJsx)(basicMitosis, {
            compileAwayPackages: ['@dummy/custom-mitosis'],
        });
        var output = generator({ component: component, path: path });
        expect(output).toMatchSnapshot();
    });
    if (testsArray) {
        testsArray.forEach(function (tests) {
            Object.keys(tests).forEach(function (key) {
                test(key, function () {
                    var component = (0, jsx_1.parseJsx)(tests[key]);
                    var output = generator({ component: component, path: path });
                    expect(output).toMatchSnapshot();
                });
            });
        });
    }
};
exports.runTestsForTarget = runTestsForTarget;
