import { Target } from '../types/config';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export declare const runTestsForJsx: () => void;
export declare const runTestsForSvelteSyntax: () => void;
export declare const runTestsForTarget: <X extends BaseTranspilerOptions>({ target, generator, options, }: {
    target: Target;
    generator: TranspilerGenerator<X, string>;
    options: X;
}) => void;
