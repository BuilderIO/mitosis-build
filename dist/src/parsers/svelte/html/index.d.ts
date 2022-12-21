import type { MitosisNode } from '../../../types/mitosis-node';
import type { Ast, TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';
export declare function parseHtml(ast: Ast, json: SveltosisComponent): void;
export declare function parseHtmlNode(json: SveltosisComponent, node: TemplateNode): MitosisNode | undefined;
