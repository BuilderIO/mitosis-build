import { JSONObject } from '../types/json';
import { MitosisComponent, StateValueType } from '../types/mitosis-component';
export declare const checkHasState: (component: MitosisComponent) => boolean;
/**
 * Sets StateTypeValue based on the string prefixes we've set previously.
 *
 * This is a temporary workaround until we eliminate the prefixes and make this StateValueType the
 * source of truth.
 */
export declare const getStateTypeOfValue: (value: any) => StateValueType;
export declare const mapJsonObjectToStateValue: (value: JSONObject) => MitosisComponent['state'];
