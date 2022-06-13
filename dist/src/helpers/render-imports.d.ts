import { Target } from '../types/config';
import { MitosisComponent, MitosisImport } from '../types/mitosis-component';
export declare const renderImport: ({ theImport, target, }: {
    theImport: MitosisImport;
    target: Target;
}) => string;
export declare const renderImports: ({ imports, target, }: {
    imports: MitosisImport[];
    target: Target;
}) => string;
export declare const renderPreComponent: (component: MitosisComponent, target: Target) => string;
export declare const renderExportAndLocal: (component: MitosisComponent) => string;
