import { MitosisComponent } from '../types/mitosis-component';
/**
 * Return custom imports of basic values (aka things
 * that are not ClassCase like components and types)
 *
 * For for code like:
 *   import { foo, bar } from './constants'
 *
 * Will return:
 *   ['foo', 'bar' ]
 *
 * This also filters for strings that appears to be actually used
 * by the template
 */
export declare function getCustomImports(json: MitosisComponent): string[];
