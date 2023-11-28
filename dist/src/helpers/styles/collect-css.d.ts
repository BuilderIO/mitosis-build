import { MitosisComponent } from '../../types/mitosis-component';
type CollectStyleOptions = {
    prefix?: string;
};
export declare const collectCss: (json: MitosisComponent, options?: CollectStyleOptions) => string;
export {};
