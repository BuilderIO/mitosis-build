import { Target } from '../types/config';
import { MitosisComponent, MitosisImport } from '../types/mitosis-component';
export declare const checkIsComponentImport: (theImport: MitosisImport) => boolean;
export declare const transformImportPath: ({ theImport, target, preserveFileExtensions, }: {
    theImport: MitosisImport;
    target: Target;
    preserveFileExtensions: boolean;
}) => string;
export declare const renderImport: ({ theImport, target, asyncComponentImports, preserveFileExtensions, component, componentsUsed, importMapper, }: {
    theImport: MitosisImport;
    target: Target;
    asyncComponentImports: boolean;
    preserveFileExtensions?: boolean | undefined;
    component?: MitosisComponent | null | undefined;
    componentsUsed?: string[] | undefined;
    importMapper?: Function | null | undefined;
}) => string;
export declare const renderImports: ({ imports, target, asyncComponentImports, excludeMitosisComponents, preserveFileExtensions, component, componentsUsed, importMapper, }: {
    imports: MitosisImport[];
    target: Target;
    asyncComponentImports: boolean;
    excludeMitosisComponents?: boolean | undefined;
    preserveFileExtensions?: boolean | undefined;
    component: MitosisComponent;
    componentsUsed?: string[] | undefined;
    importMapper?: Function | null | undefined;
}) => string;
export declare const renderPreComponent: ({ component, target, excludeMitosisComponents, asyncComponentImports, preserveFileExtensions, componentsUsed, importMapper, }: {
    component: MitosisComponent;
    target: Target;
    asyncComponentImports?: boolean | undefined;
    excludeMitosisComponents?: boolean | undefined;
    preserveFileExtensions?: boolean | undefined;
    componentsUsed?: string[] | undefined;
    importMapper?: Function | null | undefined;
}) => string;
export declare const renderExportAndLocal: (component: MitosisComponent) => string;
