import { MitosisConfig, Target } from '../types/config';
export declare const COMPONENT_IMPORT_EXTENSIONS: string[];
export declare const checkIsSvelteComponentFilePath: (filePath: string) => boolean;
export declare const checkIsLiteComponentFilePath: (filePath: string) => boolean;
export declare const checkIsMitosisComponentFilePath: (filePath: string) => boolean;
/**
 * Matches `.svelte`, `.lite.tsx`, `.lite.jsx` files (with optional `.jsx`/`.tsx` extension)
 */
export declare const INPUT_EXTENSION_REGEX: RegExp;
export declare const renameComponentFile: ({ path, target, options, }: {
    path: string;
    target: Target;
    options: MitosisConfig;
}) => string;
export declare const renameComponentImport: ({ importPath, target, explicitImportFileExtension, }: {
    importPath: string;
    target: Target;
    explicitImportFileExtension: boolean;
}) => string;
export declare const renameImport: ({ importPath, target, explicitImportFileExtension, }: {
    importPath: string;
    target: Target;
    explicitImportFileExtension: boolean;
}) => string;
type Args = {
    target: Target;
} & ({
    /**
     * Whether we are rendering an import statement or a filename.
     */
    type: 'import';
    explicitImportFileExtension: boolean;
} | {
    /**
     * Whether we are rendering an import statement or a filename.
     */
    type: 'filename';
    isTypescript: boolean;
});
/**
 * Provides the correct file extension for a given component. This is used:
 *  - in `core` to render import statements within other components.
 *  - in `cli` to render filenames for generated components, and import statements within plain `.js`/`.ts` files.
 */
export declare const getComponentFileExtensionForTarget: (args: Args) => string;
export declare const getFileExtensionForTarget: ({ target, explicitImportFileExtension, }: {
    target: Target;
    explicitImportFileExtension: boolean;
}) => string;
export {};
