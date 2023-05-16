import type { ExpressionStatement, VariableDeclaration } from 'estree';
import type { SveltosisComponent } from '../types';
export declare function parseGetContext(json: SveltosisComponent, node: VariableDeclaration): void;
export declare function parseHasContext(json: SveltosisComponent, node: VariableDeclaration): void;
export declare function parseSetContext(json: SveltosisComponent, node: ExpressionStatement): void;
