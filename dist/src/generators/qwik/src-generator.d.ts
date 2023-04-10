export interface SrcBuilderOptions {
    isPretty: boolean;
    isTypeScript: boolean;
    isModule: boolean;
    isJSX: boolean;
    isBuilder: boolean;
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
    import(module: string, symbol: string, as?: string): Symbol;
    toQrlChunk(): string;
    exportConst(name: string, value?: any, locallyVisible?: boolean): void;
    exportDefault(symbolName: any): void;
    toString(): string;
}
export declare class SrcBuilder {
    file: File;
    isTypeScript: boolean;
    isModule: boolean;
    isJSX: boolean;
    buf: string[];
    jsxDepth: number;
    /**
     * Used to signal that we are generating code for Builder.
     *
     * In builder the `<For/>` iteration places the value on the state.
     */
    isBuilder: any;
    constructor(file: File, options: SrcBuilderOptions);
    import(module: string, symbols: Symbol[]): this;
    emit(...values: any[]): this;
    private push;
    emitList(values: any[], sep?: string): this;
    const(name: string, value?: any, export_?: boolean, locallyVisible?: boolean): this;
    type(def: string): this;
    typeParameters(typeParameters: string[] | undefined): void;
    jsxExpression(expression: EmitFn): void;
    jsxBegin(symbol: Symbol | string, props: Record<string, any>, bindings: Record<string, any>): void;
    isSelfClosingTag(symbol: Symbol | string): boolean;
    jsxEnd(symbol: Symbol | string): void;
    jsxBeginFragment(symbol: Symbol): void;
    jsxEndFragment(): void;
    jsxTextBinding(exp: string): void;
    toString(): string;
}
export declare class Symbol {
    importName: string;
    localName: string;
    constructor(importName: string, localName: string);
}
export declare class Imports {
    imports: Map<string, Map<string, Symbol>>;
    get(moduleName: string, symbolName: string, asVar?: string): Symbol;
    hasImport(localName: string): boolean;
}
export declare function quote(text: string): string;
export declare function invoke(symbol: Symbol | string, args: any[], typeParameters?: string[]): (this: SrcBuilder) => void;
export declare function arrowFnBlock(args: string[], statements: any[], argTypes?: string[]): (this: SrcBuilder) => void;
export declare function arrowFnValue(args: string[], expression: any): (this: SrcBuilder) => void;
export declare function iif(code: any): ((this: SrcBuilder) => void) | undefined;
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
