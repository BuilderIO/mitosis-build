import type { VariableDeclaration, Expression, Pattern } from 'estree';
import type { SveltosisComponent } from '../types';
export declare function getParsedValue(json: SveltosisComponent, element: Expression | Pattern): {};
export declare function parseReferences(json: SveltosisComponent, node: VariableDeclaration): void;
