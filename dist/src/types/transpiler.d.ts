import { MitosisComponent } from './mitosis-component';
import { Plugin } from './plugins';
export interface TranspilerArgs {
    path?: string;
    component: MitosisComponent;
}
export declare type Transpiler = (args: TranspilerArgs) => string;
export interface BaseTranspilerOptions {
    experimental?: {
        [key: string]: any;
    };
    prettier?: boolean;
    plugins?: Plugin[];
}
