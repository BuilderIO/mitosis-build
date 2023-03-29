import { MitosisComponent } from '../../../types/mitosis-component';
import { File } from '../src-generator';
/**
 * Stores getters and initialization map.
 */
export declare type StateInit = [
    StateValues,
    /**
     * Set of state initializers.
     */
    ...string[]
];
export declare type PropertyName = string;
export declare type StateValue = string;
/**
 * Map of getters that need to be rewritten to function invocations.
 */
export declare type StateValues = Record<PropertyName, StateValue>;
/**
 * @param file
 * @param stateInit
 */
export declare function emitUseStore(file: File, stateInit: StateInit): void;
export declare function emitStateMethodsAndRewriteBindings(file: File, component: MitosisComponent, metadata: Record<string, any>): StateInit;
export declare function getLexicalScopeVars(component: MitosisComponent): string[];
export declare type MethodMap = Record<string, 'method' | 'getter'>;
export declare function getStateMethodsAndGetters(state: MitosisComponent['state']): MethodMap;
