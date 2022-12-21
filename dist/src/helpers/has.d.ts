import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
/**
 * Test if the component has something
 *
 * e.g.
 *    const hasSpread = has(component, node => some(node.bindings, { type: 'spread' }));
 */
export declare function has(json: MitosisComponent, test: (node: MitosisNode) => boolean): boolean;
