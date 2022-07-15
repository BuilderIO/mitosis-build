import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisComponent } from '../types/mitosis-component';
export declare type SymbolHierarchy = {
    depthFirstSymbols: BuilderElement[];
} & {
    [id: string]: string[];
};
/**
 * Ensure every symbol in a BuilderContent tree has a unique ID.
 * Mutates the data tree directly.
 */
export declare function ensureAllSymbolsHaveIds(content: BuilderContent): void;
export declare function convertBuilderContentToSymbolHierarchy(content: BuilderContent, { collectComponentStyles, collectComponentState, }?: {
    collectComponentStyles?: string[];
    collectComponentState?: Record<string, any>;
}): SymbolHierarchy;
export declare function convertBuilderElementToMitosisComponent(element: BuilderElement): MitosisComponent | null;
export declare function getJsxSymbolComponentName(id: string): string;
export declare function hashCodeAsString(obj: any): string;
export declare function hashCode(obj: any, hash?: number): number;
