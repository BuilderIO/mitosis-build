export declare type SlotMapper = (slotName: string) => string;
export declare const isSlotProperty: (key: string) => boolean;
export declare const stripSlotPrefix: (key: string) => string;
export declare function replaceSlotsInString(code: string, mapper: SlotMapper): string;
