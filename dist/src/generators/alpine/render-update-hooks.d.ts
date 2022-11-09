import { MitosisComponent } from '../../types/mitosis-component';
export declare function hasRootUpdateHook(json: MitosisComponent): boolean;
export declare const renderUpdateHooks: import("lodash").CurriedFunction2<MitosisComponent, string, string>;
export declare const hasWatchHooks: (json: MitosisComponent) => boolean;
export declare const renderWatchHooks: (json: MitosisComponent) => string;
