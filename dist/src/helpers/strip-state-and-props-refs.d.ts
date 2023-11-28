export type StripStateAndPropsRefsOptions = {
    replaceWith?: string | ((name: string) => string);
    includeProps?: boolean;
    includeState?: boolean;
};
/**
 * Do not use this anywhere. We are migrating to AST transforms and should avoid Regex String.replace() as they are
 * very brittle.
 *
 * If you need to re-use this, re-create it as an AST tranform first.
 */
export declare const DO_NOT_USE_CONTEXT_VARS_TRANSFORMS: ({ code, contextVars, context, }: {
    code: string;
    contextVars?: string[] | undefined;
    context: string;
}) => string;
export type DO_NOT_USE_ARGS = {
    outputVars?: string[];
    domRefs?: string[];
    stateVars?: string[];
    contextVars?: string[];
    context?: string;
};
/**
 * Do not use these anywhere. We are migrating to AST transforms and should avoid Regex String.replace() as they are
 * very brittle.
 *
 * If you need to re-use a part of this, re-create it as an AST tranform first.
 */
export declare const DO_NOT_USE_VARS_TRANSFORMS: (newCode: string, { context, domRefs, outputVars, stateVars, contextVars }: DO_NOT_USE_ARGS) => string;
/**
 * Remove state. and props. from expressions, e.g.
 * state.foo -> foo
 *
 * This is for support for frameworks like Vue, Svelte, liquid, etc
 *
 */
export declare const stripStateAndPropsRefs: (code?: string, _options?: StripStateAndPropsRefsOptions) => string;
