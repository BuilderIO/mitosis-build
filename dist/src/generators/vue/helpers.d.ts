import { MitosisComponent } from '../../types/mitosis-component';
import { MitosisNode } from '../../types/mitosis-node';
import { ToVueOptions } from './types';
export declare const addPropertiesToJson: (properties: MitosisNode['properties']) => (json: MitosisNode) => MitosisNode;
export declare const addBindingsToJson: (bindings: MitosisNode['bindings']) => (json: MitosisNode) => MitosisNode;
export declare const getOnUpdateHookName: (index: number) => string;
export declare const invertBooleanExpression: (expression: string) => string;
export declare function encodeQuotes(string: string): string;
export declare const renameMitosisComponentsToKebabCase: (str: string) => string;
export declare function getContextNames(json: MitosisComponent): string[];
export declare function processBinding({ code, options, json, includeProps, }: {
    code: string;
    options: ToVueOptions;
    json: MitosisComponent;
    includeProps?: boolean;
}): string;
