import { SharedStateTypes } from "@huds0n/shared-state";

export declare namespace Types {
  export type Replacer = (key: string, value: any) => any;
  export type Reviver = (key: string, value: any) => any;

  export type Options<S extends SharedStateTypes.State> = {
    encryptionKey?: string | null;
    excludeKeys?: (keyof S)[];
    includeKeys?: (keyof S)[];
    load?: boolean;
    replacer?: Replacer;
    reviver?: Reviver;
    saveAutomatically?: boolean;
    saveOnBackground?: boolean;
    storeName: string;
  };
}
