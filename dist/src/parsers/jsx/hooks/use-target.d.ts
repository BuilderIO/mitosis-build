import * as babel from '@babel/core';
import { MitosisComponent, TargetBlockDefinition } from '../../../types/mitosis-component';
declare const types: typeof babel.types;
export declare const getTargetId: (component: MitosisComponent) => string;
export declare const getMagicString: (targetId: string) => string;
export declare const USE_TARGET_MAGIC_STRING = "USE_TARGET_BLOCK_";
export declare const USE_TARGET_MAGIC_REGEX: RegExp;
export declare const getIdFromMatch: (match: string) => string | undefined;
/**
 * This function finds `useTarget()` and converts it our JSON representation
 */
export declare const getUseTargetStatements: (path: babel.NodePath<babel.types.CallExpression>) => TargetBlockDefinition | undefined;
export {};
