import { Target } from '../../types/config';
export declare const getSignalMitosisImportForTarget: (target: Target) => import("../..").MitosisImport | undefined;
export declare const getSignalImportName: (code: string) => string | undefined;
/**
 * Finds all `Signal` types and replaces them with the correct type for the given target.
 * e.g. `Signal<string>` becomes `Writable<string>` for Svelte.
 */
export declare const mapSignalType: ({ code, target, signalImportName, }: {
    code: string;
    target: Target;
    signalImportName?: string | undefined;
}) => string;
/**
 * Processes the `Signal` type usage in a plain TS file:
 * - Finds the `Signal` import name
 * - Maps the `Signal` type to the target's equivalent
 * - Adds the equivalent of the `Signal` import to the file
 */
export declare const mapSignalTypeInTSFile: ({ code, target }: {
    code: string;
    target: Target;
}) => string;
