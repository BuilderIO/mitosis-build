import { Target } from '../types/config';
import { MitosisComponent, MitosisImport } from '../types/mitosis-component';
export declare const checkIsComponentImport: (theImport: MitosisImport) => boolean;
export declare const transformImportPath: ({ theImport, target, preserveFileExtensions, explicitImportFileExtension, }: {
    theImport: MitosisImport;
    target: Target;
    preserveFileExtensions: boolean;
    explicitImportFileExtension: boolean;
}) => string;
type ImportArgs = {
    target: Target;
    asyncComponentImports: boolean;
    preserveFileExtensions?: boolean;
    component?: MitosisComponent | null | undefined;
    /**
     * This is only used by Angular generator, and will be deprecated in the future.
     */
    importMapper?: Function | null | undefined;
    /**
     * This is only used by Angular generator, and will be deprecated in the future.
     */
    explicitImportFileExtension?: boolean;
    /**
     * This is only used by Angular generator, and will be deprecated in the future.
     */
    componentsUsed?: string[];
};
export declare const renderImport: ({ theImport, target, asyncComponentImports, preserveFileExtensions, component, componentsUsed, importMapper, explicitImportFileExtension, }: ImportArgs & {
    theImport: MitosisImport;
}) => string;
export declare const renderPreComponent: ({ component, target, excludeMitosisComponents, asyncComponentImports, preserveFileExtensions, componentsUsed, importMapper, explicitImportFileExtension, }: Omit<ImportArgs, "explicitImportFileExtension" | "asyncComponentImports"> & Partial<Pick<ImportArgs, "explicitImportFileExtension" | "asyncComponentImports">> & {
    component: MitosisComponent;
    target: Target;
    excludeMitosisComponents?: boolean | undefined;
}) => string;
export {};
