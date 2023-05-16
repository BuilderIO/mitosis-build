import { MitosisNode } from '../../types/mitosis-node';
import { CssStyles } from './helpers/styles';
import { File } from './src-generator';
/**
 * Convert a Mitosis nodes to a JSX nodes.
 *
 * @param file File into which the output will be written to.
 * @param directives Store for directives which we came across so that they can be imported.
 * @param handlers A set of handlers which we came across so that they can be rendered
 * @param children A list of children to convert to JSX
 * @param styles Store for styles which we came across so that they can be rendered.
 * @param key Key to be used for the node if needed
 * @param parentSymbolBindings A set of bindings from parent to be written into the child.
 * @param root True if this is the root JSX, and may need a Fragment wrapper.
 * @returns
 */
export declare function renderJSXNodes(file: File, directives: Map<string, string>, handlers: Map<string, string>, children: MitosisNode[], styles: Map<string, CssStyles>, key: string | null | undefined, parentSymbolBindings: Record<string, string>, root?: boolean): any;
