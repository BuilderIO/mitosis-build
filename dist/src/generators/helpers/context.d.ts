import { ContextGetInfo, ContextSetInfo, MitosisComponent, ReactivityType } from '../../types/mitosis-component';
export declare const hasContext: (component: MitosisComponent) => boolean;
export declare const hasSetContext: (component: MitosisComponent) => boolean;
export declare const hasGetContext: (component: MitosisComponent) => boolean;
export declare const getContextType: ({ component, context, }: {
    component: MitosisComponent;
    context: ContextGetInfo | ContextSetInfo;
}) => ReactivityType;
