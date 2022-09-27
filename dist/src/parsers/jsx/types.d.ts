import { MitosisComponent } from '../../types/mitosis-component';
export declare type ParseMitosisOptions = {
    format: 'react' | 'simple';
    jsonHookNames?: string[];
    compileAwayPackages?: string[];
};
export declare type Context = {
    builder: {
        component: MitosisComponent;
    };
};
