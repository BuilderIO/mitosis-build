export declare const WS: string;
export declare const RS = " ";
export declare const NL = "\n";
export declare const INDENT: string;
export declare const UNINDENT: string;
export interface SrcBuilderOptions {
    isPretty: boolean;
    isTypeScript: boolean;
    isModule: boolean;
    isJSX: boolean;
}
export declare type EmitFn = (this: SrcBuilder) => void;
export declare class File {
    filename: string;
    imports: Imports;
    options: SrcBuilderOptions;
    src: SrcBuilder;
    qwikModule: string;
    qrlPrefix: string;
    exports: Map<string, string>;
    get module(): string;
    get path(): string;
    get contents(): string;
    constructor(filename: string, options: SrcBuilderOptions, qwikModule: string, qrlPrefix: string);
    import(module: string, symbol: string): Symbol;
    toQrlChunk(): string;
    exportConst(name: string, value?: any, locallyVisible?: boolean): void;
    toString(): string;
}
export declare class SrcBuilder {
    isPretty: boolean;
    isTypeScript: boolean;
    isModule: boolean;
    isJSX: boolean;
    buf: string[];
    wasLastNL: boolean;
    nestingDepth: number;
    offset: number;
    constructor(options: SrcBuilderOptions);
    import(module: string, symbols: string[]): this;
    emit(...values: any[]): this;
    private push;
    emitList(values: any[], sep?: string): this;
    const(name: string, value?: any, export_?: boolean, locallyVisible?: boolean): this;
    type(def: string): this;
    typeParameters(typeParameters: string[] | undefined): void;
    jsxBegin(symbol: Symbol | string, props: Record<string, any>, bindings: Record<string, any>): void;
    jsxEnd(symbol: Symbol | string): void;
    jsxBeginFragment(symbol: Symbol): void;
    jsxEndFragment(): void;
    jsxTextBinding(exp: string): void;
    toString(): string;
}
export declare class Symbol {
    name: string;
    constructor(name: string);
}
export declare class Imports {
    imports: Map<string, Map<string, Symbol>>;
    get(moduleName: string, symbolName: string): Symbol;
}
export declare class Block {
    imports: Imports;
    constructor(imports: Imports);
}
export declare function quote(text: string): string;
export declare function invoke(symbol: Symbol | string, args: any[], typeParameters?: string[]): (this: SrcBuilder) => void;
export declare function arrowFnBlock(args: string[], statements: any[]): (this: SrcBuilder) => void;
export declare function arrowFnValue(args: string[], expression: any): (this: SrcBuilder) => void;
export declare function iif(code: any): (this: SrcBuilder) => void;
/**
 * Returns `true` if the code is a statement (rather than expression).
 *
 * Code is an expression if it is a list of identifiers all connected with a valid separator
 * identifier: [a-z_$](a-z0-9_$)*
 * separator: [()[]{}.-+/*,]
 *
 * it is not 100% but a good enough approximation
 */
export declare function isStatement(code: string): boolean;
export declare function lastProperty(expr: string): string;
export declare function iteratorProperty(expr: string): string;
