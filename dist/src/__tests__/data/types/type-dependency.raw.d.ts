import type { Foo } from './foo-type';
export declare type TypeDependencyProps = {
    foo: Foo;
};
export default function TypeDependency(props: TypeDependencyProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
