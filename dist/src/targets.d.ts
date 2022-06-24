export declare const targets: {
    angular: (options?: import("./generators/angular").ToAngularOptions) => import(".").Transpiler;
    builder: (options?: import("./generators/builder").ToBuilderOptions) => ({ component }: import(".").TranspilerArgs) => {
        data: {
            httpRequests: import("./types/json").JSON;
            jsCode: string;
            tsCode: string;
            blocks: import("@builder.io/sdk").BuilderElement[];
        };
    };
    customElement: (options?: import("./generators/html").ToHtmlOptions) => import(".").Transpiler;
    html: (options?: import("./generators/html").ToHtmlOptions) => import(".").Transpiler;
    mitosis: (toMitosisOptions?: Partial<import("./generators/mitosis").ToMitosisOptions>) => import(".").Transpiler;
    liquid: (options?: import("./generators/liquid").ToLiquidOptions) => import(".").Transpiler;
    react: (reactOptions?: import("./generators/react").ToReactOptions) => import(".").Transpiler;
    reactNative: (options?: import("./generators/react-native").ToReactNativeOptions) => import(".").Transpiler;
    solid: (options?: import("./generators/solid").ToSolidOptions) => import(".").Transpiler;
    svelte: (options?: import("./generators/svelte").ToSvelteOptions) => import(".").Transpiler;
    swift: (options?: import("./generators/swift-ui").ToSwiftOptions) => import(".").Transpiler;
    template: (options?: import("./generators/template").ToTemplateOptions) => import(".").Transpiler;
    webcomponent: (options?: import("./generators/html").ToHtmlOptions) => import(".").Transpiler;
    vue: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler;
    vue2: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler;
    vue3: (vueOptions?: Omit<import("./generators/vue").ToVueOptions, "vueVersion"> | undefined) => import(".").Transpiler;
    stencil: (options?: import("./generators/stencil").ToStencilOptions) => import(".").Transpiler;
};
