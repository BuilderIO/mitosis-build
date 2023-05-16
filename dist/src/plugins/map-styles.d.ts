import { TraverseContext } from 'traverse';
import { MitosisComponent } from '../types/mitosis-component';
import { MitosisStyles } from '../types/mitosis-styles';
declare type MapStylesOptions = {
    map: (styles: MitosisStyles, context: TraverseContext) => MitosisStyles;
};
export declare const mapStyles: (pluginOptions: MapStylesOptions) => (options: any) => {
    json: {
        pre: (json: MitosisComponent) => void;
    };
};
export {};
