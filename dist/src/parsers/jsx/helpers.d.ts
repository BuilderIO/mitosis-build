import * as babel from '@babel/core';
export declare const selfClosingTags: Set<string>;
export declare const uncapitalize: (str: string) => string;
export declare const parseCodeJson: (node: babel.types.Node) => any;
export declare const isImportOrDefaultExport: (node: babel.Node) => boolean;
