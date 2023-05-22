import { TraverseContext } from 'traverse';
import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
import { Plugin } from '..';
declare type CompileAwayComponentsMap = {
    [key: string]: (node: MitosisNode, context: TraverseContext, components: CompileAwayComponentsMap) => MitosisNode | void;
};
export declare const components: CompileAwayComponentsMap;
declare type CompileAwayBuilderComponentsOptions = {
    only?: string[];
    omit?: string[];
};
export declare const compileAwayBuilderComponentsFromTree: (tree: MitosisNode | MitosisComponent, components: CompileAwayComponentsMap) => void;
export declare const compileAwayBuilderComponents: (pluginOptions?: CompileAwayBuilderComponentsOptions) => Plugin;
export {};
