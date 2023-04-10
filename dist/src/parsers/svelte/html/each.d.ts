import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';
import { MitosisNode } from '../../../types/mitosis-node';
export declare function parseEach(json: SveltosisComponent, node: TemplateNode): MitosisNode;
