import * as babel from '@babel/core';
import { MitosisComponent } from '../../types/mitosis-component';
import { ParseMitosisOptions } from './types';
declare const types: typeof babel.types;
export declare const METADATA_HOOK_NAME = "useMetadata";
/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
export declare const collectModuleScopeHooks: (nodes: babel.types.Statement[], component: MitosisComponent, options: ParseMitosisOptions) => babel.types.Statement[];
export {};
