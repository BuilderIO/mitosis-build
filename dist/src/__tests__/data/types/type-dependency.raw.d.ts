import type { Foo } from './foo-type';
import type { Foo as Foo2 } from './type-export.lite';
export declare type TypeDependencyProps = {
    foo: Foo;
    foo2: Foo2;
};
export default function TypeDependency(props: TypeDependencyProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
