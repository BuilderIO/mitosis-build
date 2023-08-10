"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentFileExtensionForTarget = exports.renameImport = exports.renameComponentFile = exports.INPUT_EXTENSION_REGEX = exports.checkIsMitosisComponentFilePath = exports.checkIsLiteComponentFilePath = exports.checkIsSvelteComponentFilePath = exports.COMPONENT_IMPORT_EXTENSIONS = void 0;
var mitosis_1 = require("@builder.io/mitosis");
var COMPONENT_EXTENSIONS = {
    jsx: ['.lite.tsx', '.lite.jsx'],
    svelte: ['.svelte'],
};
exports.COMPONENT_IMPORT_EXTENSIONS = [COMPONENT_EXTENSIONS.svelte, COMPONENT_EXTENSIONS.jsx]
    .flat()
    .concat(['.lite']);
var checkIsSvelteComponentFilePath = function (filePath) {
    return COMPONENT_EXTENSIONS.svelte.some(function (x) { return filePath.endsWith(x); });
};
exports.checkIsSvelteComponentFilePath = checkIsSvelteComponentFilePath;
var checkIsLiteComponentFilePath = function (filePath) {
    return COMPONENT_EXTENSIONS.jsx.some(function (x) { return filePath.endsWith(x); });
};
exports.checkIsLiteComponentFilePath = checkIsLiteComponentFilePath;
var checkIsMitosisComponentFilePath = function (filePath) {
    return (0, exports.checkIsLiteComponentFilePath)(filePath) || (0, exports.checkIsSvelteComponentFilePath)(filePath);
};
exports.checkIsMitosisComponentFilePath = checkIsMitosisComponentFilePath;
/**
 * Matches `.svelte`, `.lite.tsx`, `.lite.jsx` files (with optional `.jsx`/`.tsx` extension)
 */
exports.INPUT_EXTENSION_REGEX = /\.(svelte|(lite(\.tsx|\.jsx)?))/g;
var renameComponentFile = function (_a) {
    var path = _a.path, target = _a.target, options = _a.options;
    return path.replace(exports.INPUT_EXTENSION_REGEX, (0, exports.getComponentFileExtensionForTarget)({
        type: 'filename',
        target: target,
        isTypescript: (0, mitosis_1.checkShouldOutputTypeScript)({ options: options, target: target }),
    }));
};
exports.renameComponentFile = renameComponentFile;
/**
 * just like `INPUT_EXTENSION_REGEX`, but adds trailing quotes to the end of import paths.
 */
var INPUT_EXTENSION_IMPORT_REGEX = /\.(svelte|(lite(\.tsx|\.jsx)?))(?<quote>['"])/g;
var renameImport = function (_a) {
    var importPath = _a.importPath, target = _a.target;
    return importPath.replace(INPUT_EXTENSION_IMPORT_REGEX, "".concat((0, exports.getComponentFileExtensionForTarget)({
        type: 'import',
        target: target,
    }), "$4"));
};
exports.renameImport = renameImport;
/**
 * Provides the correct file extension for a given component. This is used:
 *  - in `core` to render import statements within other components.
 *  - in `cli` to render filenames for generated components, and import statements within plain `.js`/`.ts` files.
 */
var getComponentFileExtensionForTarget = function (args) {
    switch (args.target) {
        case 'angular':
            return '.ts';
        case 'alpine':
        case 'html':
            return '.html';
        case 'svelte':
            return '.svelte';
        case 'swift':
            return '.swift';
        case 'vue':
        case 'vue2':
        case 'vue3':
            return '.vue';
        case 'webcomponent':
            return '.ts';
        case 'lit':
            return '.ts';
        case 'qwik': {
            switch (args.type) {
                case 'import':
                    return '.jsx';
                case 'filename':
                    return args.isTypescript ? '.tsx' : '.jsx';
            }
        }
        case 'solid':
        case 'preact':
        case 'react':
        case 'reactNative':
        case 'rsc':
        case 'stencil':
            switch (args.type) {
                case 'import':
                    // we can't have `.jsx`/`.tsx` extensions in the import paths, so we stick with implicit file extensions.
                    return '';
                case 'filename':
                    return args.isTypescript ? '.tsx' : '.jsx';
            }
        case 'marko':
            return '.marko';
        default:
            return '.js';
    }
};
exports.getComponentFileExtensionForTarget = getComponentFileExtensionForTarget;
