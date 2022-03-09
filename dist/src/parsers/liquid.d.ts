import { BuilderElement } from '@builder.io/sdk';
import { ITemplate } from 'liquidjs';
import * as compiler from 'vue-template-compiler';
/**
 * Extract a liquid expression from our JS structure - i.e. transform
 * "context.shopify.liquid.condition('some | liquid')" to "some | liquid"
 */
export declare const getLiquidConditionExpresion: (expression: string) => string;
interface Options {
    emailMode?: boolean;
    extractCss?: boolean;
    minify?: boolean;
    includeJson?: boolean;
    skipPrettier?: boolean;
    wrap?: boolean;
    useBuilderSignature?: boolean;
    componentOnly?: boolean;
    openingTagOnly?: boolean;
    static?: boolean;
    looseBindings?: boolean;
}
export declare function blockToLiquid(json: BuilderElement, options?: Options): string;
export declare function humanCase(str: string): string;
export declare const parsedLiquidToHtml: (templates: ITemplate[], options: LiquidToBuilderOptions) => Promise<string>;
export declare const htmlNodeToBuilder: (node: compiler.ASTNode, index: number, parentArray: compiler.ASTNode[], options: LiquidToBuilderOptions) => Promise<BuilderElement | BuilderElement[] | null>;
export declare const liquidToAst: (str: string, options?: LiquidToBuilderOptions) => ITemplate[];
export declare const htmlToAst: (html: string) => {
    htmlNodes: compiler.ASTNode[];
    preprocessed: compiler.ASTNode[];
};
export declare const separateTagsAndText: (text: string) => compiler.ASTText[];
export declare const postProcessHtmlAstNodes: (nodes: compiler.ASTNode[]) => compiler.ASTNode[];
export declare const postProcessBuilderTree: (nodes: BuilderElement[], options: LiquidToBuilderOptions) => Promise<BuilderElement[]>;
export declare const htmlAstToBuilder: (nodes: compiler.ASTNode[], options: LiquidToBuilderOptions) => Promise<BuilderElement[]>;
export declare const processedAstToBuilder: (nodes: compiler.ASTNode[], options: LiquidToBuilderOptions) => Promise<{
    blocks: BuilderElement[];
    preprocessed: BuilderElement[];
}>;
export interface LiquidToBuilderOptions {
    log?: boolean;
    themeId?: string;
    importSections?: boolean;
    importSnippets?: boolean;
    translations?: {
        [key: string]: string;
    };
    cachebust?: boolean;
    auth?: {
        token?: string;
        publicKey?: string;
    };
}
export declare const htmlDebugString: (els: BuilderElement[]) => string;
export declare const tryFormat: (str: string) => string;
/**
 * This function is the first step, before we turn the liquid into an AST.
 * It is used to make certain changes to the liquid string that are much
 * easier to do before we process it. Examples of this include rewriting
 * certain tags to a format we already know how to parse, or fixing common
 * liquid template errors that cause problems during import.
 *
 * Note: there are a lot of regexes in here, and they can be confusing!
 * If you are trying to debug something that includes a regex, try using
 * a tool like https://regex101.com/ to break down what is going on.
 */
export declare const preprocessLiquid: (liquid: string, options?: LiquidToBuilderOptions) => Promise<string>;
export declare const liquidToBuilder: (liquid: string, options?: LiquidToBuilderOptions) => Promise<BuilderElement[]>;
export declare const htmlToBuilder: (html: string) => Promise<BuilderElement[]>;
export declare const bindingsFromAttrs: (node: compiler.ASTElement, bindings: Record<string, any>, properties: Record<string, any>, options: LiquidToBuilderOptions) => Promise<void>;
export {};
