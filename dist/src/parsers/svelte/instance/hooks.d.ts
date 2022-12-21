import type { ExpressionStatement } from 'estree';
import type { SveltosisComponent } from '../types';
export declare function parseOnMount(json: SveltosisComponent, node: ExpressionStatement): void;
export declare function parseOnDestroy(json: SveltosisComponent, node: ExpressionStatement): void;
export declare function parseAfterUpdate(json: SveltosisComponent, node: ExpressionStatement): void;
