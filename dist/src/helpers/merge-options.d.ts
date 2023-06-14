import { BaseTranspilerOptions, Target } from '..';
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
export declare const mergeOptions: <T extends BaseTranspilerOptions>(a: T, b?: Partial<T>, c?: Partial<T> | undefined) => T & {
    plugins: NonNullable<T["plugins"]>;
};
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
export declare const initializeOptions: <T extends BaseTranspilerOptions>(target: Target, a: T, b?: Partial<T>, c?: Partial<T> | undefined) => T & {
    plugins: NonNullable<T["plugins"]>;
};
