import { MitosisNode } from '../../..';
import { SrcBuilder } from '../src-generator';
export declare type CssStyles = {
    CLASS_NAME: string;
} & Record<string, string>;
export declare function collectStyles(children: MitosisNode[], styleMap: Map<string, CssStyles>): Map<string, CssStyles>;
export declare function renderStyles(styles: Map<string, CssStyles>): (this: SrcBuilder) => void;
