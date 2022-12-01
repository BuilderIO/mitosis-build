export declare type StripStateAndPropsRefsOptions = {
    replaceWith?: string | ((name: string) => string);
    includeProps?: boolean;
    includeState?: boolean;
    contextVars?: string[];
    outputVars?: string[];
    stateVars?: string[];
    context?: string;
    domRefs?: string[];
};
/**
 * Remove state. and props. from expressions, e.g.
 * state.foo -> foo
 *
 * This is for support for frameworks like Vue, Svelte, liquid, etc
 *
 */
export declare const stripStateAndPropsRefs: (code?: string, _options?: StripStateAndPropsRefsOptions) => string;
