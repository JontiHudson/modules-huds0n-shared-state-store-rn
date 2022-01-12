import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import CryptoJS from "react-native-crypto-js";

import Error from "@huds0n/error";
import type { SharedState } from "@huds0n/shared-state";

import type { Types } from "./types";

export class SharedStateStore<S> {
  private _options: Types.Options<S>;
  private _sharedState: SharedState<S>;

  constructor(sharedState: SharedState<S>, options: Types.Options<S>) {
    const { load = true, saveAutomatically, saveOnBackground } = options;

    this._options = options;
    this._sharedState = sharedState;

    if (saveAutomatically) {
      sharedState.addListener(() => {
        this.save();
      });
    }

    if (saveOnBackground) {
      AppState.addEventListener("change", (nextAppState) => {
        if (nextAppState === "background") {
          this.save();
        }
      });
    }

    if (load) {
      this.load();
    }

    this.delete = this.delete.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
  }

  get name() {
    return this._options.storeName;
  }

  get sharedState() {
    return this._sharedState;
  }

  async save(state: S = this._sharedState.state): Promise<boolean> {
    const { encryptionKey, excludeKeys, includeKeys, replacer, storeName } =
      this._options;

    try {
      let saveState: Partial<S> = state;

      if (includeKeys || excludeKeys) {
        const saveEntries = Object.entries(saveState).filter(([key]) =>
          includeKeys
            ? includeKeys.includes(key as keyof S)
            : !excludeKeys?.includes(key as keyof S)
        );

        if (!saveEntries.length) {
          return false;
        }

        saveState = Object.fromEntries(saveEntries) as Partial<S>;
      }

      let stateString = JSON.stringify(saveState, replacer);
      if (encryptionKey) {
        stateString = CryptoJS.AES.encrypt(
          stateString,
          encryptionKey
        ).toString();
      }
      await AsyncStorage.setItem(storeName, stateString);

      return true;
    } catch (error) {
      Error.transform(error, {
        name: "State Error",
        code: "STORAGE_SAVE_ERROR",
        message: "Unable to save state",
        info: { storeName },
        severity: "HIGH",
      });

      return false;
    }
  }

  async load(): Promise<Partial<S> | null> {
    const { encryptionKey, excludeKeys, includeKeys, reviver, storeName } =
      this._options;

    try {
      let stateString = (await AsyncStorage.getItem(storeName)) as string;

      if (!stateString) {
        return null;
      }

      if (encryptionKey && stateString) {
        stateString = CryptoJS.AES.decrypt(stateString, encryptionKey);
        // @ts-ignore
        stateString = stateString.toString(CryptoJS.enc.Utf8);
      }

      let retrievedState: Partial<S> = JSON.parse(stateString, reviver);

      if (includeKeys) {
        retrievedState = { ...this._sharedState.state, ...retrievedState };
      } else if (excludeKeys) {
        const currentState = this._sharedState.state;
        excludeKeys.forEach((key) => (retrievedState[key] = currentState[key]));
      }

      this._sharedState.setState(retrievedState);

      return retrievedState;
    } catch (error) {
      throw Error.transform(error, {
        name: "State Error",
        code: "STORAGE_ERROR",
        message: "Error loading from storage",
        severity: "HIGH",
      });
    }
  }

  async delete(): Promise<void> {
    const { storeName } = this._options;

    try {
      await AsyncStorage.removeItem(storeName);
    } catch (error) {
      throw Error.transform(error, {
        name: "State Error",
        code: "STORAGE_DELETE_ERROR",
        message: "Unable to delete state",
        info: { storeName },
        severity: "HIGH",
      });
    }
  }
}

export type { Types as SharedStateStoreRNTypes };
