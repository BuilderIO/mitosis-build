import { JSONObject } from '../types/json';
import { MitosisComponent } from '../types/mitosis-component';
export declare const checkHasState: (component: MitosisComponent) => boolean;
export declare const mapJsonObjectToStateValue: (value: JSONObject) => MitosisComponent['state'];
