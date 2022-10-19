export declare const builder: (options?: import("./generators/builder").ToBuilderOptions) => ({ component }: import(".").TranspilerArgs) => import("@builder.io/sdk").BuilderContent;
export declare const targets: {
    readonly angular: import(".").TranspilerGenerator<import("./generators/angular").ToAngularOptions, string>;
    readonly customElement: import(".").TranspilerGenerator<import("./generators/html").ToHtmlOptions, string>;
    readonly html: import(".").TranspilerGenerator<import("./generators/html").ToHtmlOptions, string>;
    readonly mitosis: import(".").TranspilerGenerator<Partial<import("./generators/mitosis").ToMitosisOptions>, string>;
    readonly liquid: import(".").TranspilerGenerator<import("./generators/liquid").ToLiquidOptions, string>;
    readonly react: import(".").TranspilerGenerator<import("./generators/react").ToReactOptions, string>;
    readonly reactNative: import(".").TranspilerGenerator<import("./generators/react-native").ToReactNativeOptions, string>;
    readonly solid: import(".").TranspilerGenerator<Partial<import("./generators/solid/types").ToSolidOptions>, string>;
    readonly svelte: import(".").TranspilerGenerator<import("./generators/svelte/types").ToSvelteOptions, string>;
    readonly swift: import(".").TranspilerGenerator<import(".").BaseTranspilerOptions, string>;
    readonly template: import(".").TranspilerGenerator<import("./generators/template").ToTemplateOptions, string>;
    readonly webcomponent: import(".").TranspilerGenerator<import("./generators/html").ToHtmlOptions, string>;
    readonly vue: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler<string>;
    readonly vue2: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler<string>;
    readonly vue3: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler<string>;
    readonly stencil: import(".").TranspilerGenerator<import("./generators/stencil").ToStencilOptions, string>;
    readonly qwik: import(".").TranspilerGenerator<import("./generators/qwik/component-generator").ToQwikOptions, string>;
    readonly marko: import(".").TranspilerGenerator<import("./generators/marko").ToMarkoOptions, string>;
    readonly preact: import(".").TranspilerGenerator<import("./generators/react").ToReactOptions, string>;
    readonly lit: import(".").TranspilerGenerator<import("./generators/lit").ToLitOptions, string>;
    readonly rsc: import(".").TranspilerGenerator<import("./generators/rsc").ToRscOptions, string>;
};
