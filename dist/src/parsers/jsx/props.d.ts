import * as babel from '@babel/core';
import { Context } from './types';
export declare function undoPropsDestructure(path: babel.NodePath<babel.types.FunctionDeclaration>): void;
export declare function collectDefaultProps(path: babel.NodePath<babel.types.Program>, context: Context): void;
