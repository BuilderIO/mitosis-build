import { Target } from '../types/config';
import { MitosisComponent, MitosisImport } from '../types/mitosis-component';
export declare const checkIsComponentImport: (theImport: MitosisImport) => boolean;
export declare const renderImport: ({ theImport, target, asyncComponentImports, preserveFileExtensions, }: {
    theImport: MitosisImport;
    target: Target;
    asyncComponentImports: boolean;
    preserveFileExtensions?: boolean | undefined;
}) => string;
export declare const renderImports: ({ imports, target, asyncComponentImports, excludeMitosisComponents, preserveFileExtensions, }: {
    imports: MitosisImport[];
    target: Target;
    asyncComponentImports: boolean;
    excludeMitosisComponents?: boolean | undefined;
    preserveFileExtensions?: boolean | undefined;
}) => string;
export declare const renderPreComponent: ({ component, target, excludeMitosisComponents, asyncComponentImports, preserveFileExtensions, }: {
    component: MitosisComponent;
    target: Target;
    asyncComponentImports?: boolean | undefined;
    excludeMitosisComponents?: boolean | undefined;
    preserveFileExtensions?: boolean | undefined;
}) => string;
export declare const renderExportAndLocal: (component: MitosisComponent) => string;
