import { Project, Symbol } from 'ts-morph';
import { MitosisComponent } from '../../types/mitosis-component';
export declare type ParseMitosisOptions = {
    jsonHookNames?: string[];
    compileAwayPackages?: string[];
    typescript: boolean;
    tsProject?: {
        project: Project;
        signalSymbol: Symbol;
    };
    filePath?: string;
};
export declare type Context = {
    builder: {
        component: MitosisComponent;
    };
};
