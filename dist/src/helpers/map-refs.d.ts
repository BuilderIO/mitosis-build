import { MitosisComponent } from '../types/mitosis-component';
export declare type RefMapper = (refName: string) => string;
export declare const mapRefs: (component: MitosisComponent, mapper: RefMapper) => void;
