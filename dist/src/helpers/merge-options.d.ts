import { BaseTranspilerOptions } from '..';
/**
 * Merges options while combining the `plugins` array.
 */
export declare const mergeOptions: <T extends BaseTranspilerOptions>(a: T, b?: Partial<T>, c?: Partial<T> | undefined) => T & {
    plugins: NonNullable<T["plugins"]>;
};
