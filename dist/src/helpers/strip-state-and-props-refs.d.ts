export declare type StripStateAndPropsRefsOptions = {
    replaceWith?: string | ((name: string) => string);
    includeProps?: boolean;
    includeState?: boolean;
    contextVars?: string[];
    outputVars?: string[];
    context?: string;
};
/**
 * Remove state. and props. from expressions, e.g.
 * state.foo -> foo
 *
 * This is for support for frameworks like Vue, Svelte, liquid,  etc
 *
 * @todo proper ref replacement with babel
 */
export declare const stripStateAndPropsRefs: (code?: string | undefined, options?: StripStateAndPropsRefsOptions) => string;
