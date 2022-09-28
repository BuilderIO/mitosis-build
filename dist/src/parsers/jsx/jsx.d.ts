import { MitosisComponent } from '../../types/mitosis-component';
import { ParseMitosisOptions } from './types';
/**
 * This function takes the raw string from a Mitosis component, and converts it into a JSON that can be processed by
 * each generator function.
 *
 * @param jsx string representation of the Mitosis component
 * @returns A JSON representation of the Mitosis component
 */
export declare function parseJsx(jsx: string, _options?: Partial<ParseMitosisOptions>): MitosisComponent;
