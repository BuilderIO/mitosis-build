import { JSX } from '../jsx-runtime';
/**
 * Flow control based on Solid
 *
 * https://github.com/ryansolid/solid/blob/master/packages/solid/src/rendering/flow.ts
 * https://github.com/ryansolid/solid/blob/master/documentation/rendering.md
 *
 * These elements all compile away so they return `null`
 */
export declare function For<T, U extends JSX.Element>(props: {
    each?: readonly T[];
    children: (item: T, index: number) => U;
}): any;
export declare function Slot<T, U extends JSX.Element>(props: {
    name?: JSX.Element;
} | {
    [key: string]: any;
}): any;
export declare function Show<T>(props: {
    when: T | undefined | null | false;
    else?: JSX.Element;
    children?: JSX.Element | null;
}): any;
export declare function Fragment(props: {
    children: JSX.Element | JSX.Element[];
}): any;
