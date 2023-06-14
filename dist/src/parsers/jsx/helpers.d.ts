import * as babel from '@babel/core';
declare const types: typeof babel.types;
export declare const uncapitalize: (str: string) => string;
export declare const parseCode: (node: babel.types.Node) => string;
export declare const parseCodeJson: (node: babel.types.Node) => any;
export declare const isImportOrDefaultExport: (node: babel.Node) => boolean;
export declare const HTML_ATTR_FROM_JSX: {
    htmlFor: string;
};
export declare const transformAttributeName: (name: string) => string;
export {};
