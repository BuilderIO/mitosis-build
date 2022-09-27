export declare type ParseReactiveScriptOptions = {
    format: 'html' | 'js';
};
export declare const reactiveScriptRe: RegExp;
export declare function parseReactiveScript(code: string, options: ParseReactiveScriptOptions): {
    state: any;
};
