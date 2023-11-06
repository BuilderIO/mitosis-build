import { MitosisComponent, MitosisNode, OnEventHook, Plugin } from '..';
export declare const getOnEventHandlerName: (hook: OnEventHook) => string;
export declare const getOnEventHooksForNode: ({ node, component, }: {
    node: MitosisNode;
    component: MitosisComponent;
}) => OnEventHook[];
/**
 * Adds event handlers from `onEvent` hooks to the appropriate node's bindings.
 * Only works with frameworks that support custom events in their templates.
 */
export declare const processOnEventHooksPlugin: (args?: {
    setBindings?: boolean;
    includeRootEvents?: boolean;
}) => Plugin;
