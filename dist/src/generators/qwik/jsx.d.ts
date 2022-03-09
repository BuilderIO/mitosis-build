import { MitosisNode } from '../../types/mitosis-node';
import { File } from './src-generator';
import { CssStyles } from './styles';
export declare function renderJSXNodes(file: File, directives: Map<string, string>, handlers: Map<string, string>, children: MitosisNode[], styles: Map<string, CssStyles>, parentSymbolBindings: Record<string, string>, root?: boolean): any;
