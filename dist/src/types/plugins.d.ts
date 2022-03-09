import { MitosisComponent } from './mitosis-component';
export declare type Plugin = (options?: any) => {
    json?: {
        pre?: (json: MitosisComponent) => MitosisComponent | void;
        post?: (json: MitosisComponent) => MitosisComponent | void;
    };
    code?: {
        pre?: (code: string) => string;
        post?: (code: string) => string;
    };
};
