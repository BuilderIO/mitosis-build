import { Node, types } from '@babel/core';
import { Target } from '../../types/config';
import { Plugin } from '../../types/plugins';
export declare const replaceSignalSetters: ({ code, nodeMaps, }: {
    code: string;
    nodeMaps: {
        from: types.Node;
        setTo: types.Expression;
    }[];
}) => string;
/**
 * Processes `Signal` type imports, transforming them to the target's equivalent and adding the import to the component.
 */
export declare const getSignalTypePlugin: ({ target }: {
    target: Target;
}) => Plugin;
/**
 * Processes `mySignal.value` accessors for props, context, and state.
 */
export declare const getSignalAccessPlugin: ({ target }: {
    target: Target;
}) => Plugin;
