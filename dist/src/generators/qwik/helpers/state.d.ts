import { ComponentMetadata } from '../../../types/metadata';
import { MitosisComponent } from '../../../types/mitosis-component';
import { File } from '../src-generator';
/**
 * Stores getters and initialization map.
 */
export type StateInit = [
    StateValues,
    /**
     * Set of state initializers.
     */
    ...string[]
];
export type PropertyName = string;
export type StateValue = string;
/**
 * Map of getters that need to be rewritten to function invocations.
 */
export type StateValues = Record<PropertyName, StateValue>;
/**
 * @param file
 * @param stateInit
 */
export declare function emitUseStore({ file, stateInit, isDeep, }: {
    file: File;
    stateInit: StateInit;
    isDeep?: boolean;
}): void;
export declare function emitStateMethodsAndRewriteBindings(file: File, component: MitosisComponent, metadata?: ComponentMetadata): StateInit;
export declare function getLexicalScopeVars(component: MitosisComponent): string[];
export type MethodMap = Record<string, 'method' | 'getter'>;
export declare function getStateMethodsAndGetters(state: MitosisComponent['state']): MethodMap;
