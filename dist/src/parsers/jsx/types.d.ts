import { MitosisComponent } from '../../types/mitosis-component';
export declare type ParseMitosisOptions = {
    jsonHookNames?: string[];
    compileAwayPackages?: string[];
    typescript: boolean;
};
export declare type Context = {
    builder: {
        component: MitosisComponent;
    };
};
