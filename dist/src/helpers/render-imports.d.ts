import { Target } from '../types/config';
import { MitosisComponent, MitosisImport } from '../types/mitosis-component';
export declare const renderImport: ({ theImport, target, asyncComponentImports, }: {
    theImport: MitosisImport;
    target: Target;
    asyncComponentImports: boolean;
}) => string;
export declare const renderImports: ({ imports, target, asyncComponentImports, excludeMitosisComponents, }: {
    imports: MitosisImport[];
    target: Target;
    asyncComponentImports: boolean;
    excludeMitosisComponents?: boolean | undefined;
}) => string;
export declare const renderPreComponent: ({ component, target, excludeMitosisComponents, asyncComponentImports, }: {
    component: MitosisComponent;
    target: Target;
    asyncComponentImports?: boolean | undefined;
    excludeMitosisComponents?: boolean | undefined;
}) => string;
export declare const renderExportAndLocal: (component: MitosisComponent) => string;
