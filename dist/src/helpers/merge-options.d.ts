import { BaseTranspilerOptions, MitosisComponent, Target } from '..';
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
export declare const mergeOptions: <T extends BaseTranspilerOptions>(a: T, b?: Partial<T>, c?: Partial<T> | undefined, d?: Partial<T> | undefined) => T & {
    plugins: NonNullable<T["plugins"]>;
};
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
export declare const initializeOptions: <T extends BaseTranspilerOptions>({ target, component, defaults, userOptions, extra, }: {
    target: Target;
    component: MitosisComponent;
    defaults: T;
    userOptions?: Partial<T> | undefined;
    extra?: Partial<T> | undefined;
}) => T & {
    plugins: NonNullable<T["plugins"]>;
};
