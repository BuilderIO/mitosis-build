import { Project } from 'ts-morph';
import { MitosisComponent } from '../../types/mitosis-component';
export type ParseMitosisOptions = {
    jsonHookNames?: string[];
    compileAwayPackages?: string[];
    typescript: boolean;
    tsProject?: {
        project: Project;
    };
    filePath?: string;
};
export type Context = {
    builder: {
        component: MitosisComponent;
    };
};
