import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import CryptoJS from 'react-native-crypto-js';

import Error from '@huds0n/error';
import { SharedState } from '@huds0n/shared-state';

export namespace createStoreRN {
  type State = SharedState.State;

  export type ReplacerFn = (key: string, value: any) => any;
  export type ReviverFn = (key: string, value: any) => any;

  export type Options = {
    encryptionKey?: string;
    excludeKeys?: string[];
    includeKeys?: string[];
    replacer?: ReplacerFn;
    reviver?: (key: string, value: any) => any;
    saveOnBackground?: boolean;
    saveAutomatically?: boolean;
    storeName: string;
  };

  export type CreateStateStoreFunction<
    S extends State
  > = SharedState.CreateStateStoreFunction<S>;
}

export function createStoreRN<S extends SharedState.State>({
  encryptionKey,
  excludeKeys,
  includeKeys,
  replacer,
  reviver,
  saveOnBackground,
  saveAutomatically = false,
  storeName,
}: createStoreRN.Options): createStoreRN.CreateStateStoreFunction<S> {
  return <S extends SharedState.State>(getState: () => S) => {
    const store = {
      storeName,
      saveAutomatically,

      async delete(): Promise<boolean> {
        try {
          await AsyncStorage.removeItem(storeName);
          return true;
        } catch (error) {
          Error.transform(error, {
            name: 'State Error',
            code: 'STORAGE_DELETE_ERROR',
            message: 'Unable to delete state',
            info: { storeName },
            severity: 'HIGH',
          });
          return false;
        }
      },

      async retrieve(): Promise<S | null> {
        try {
          let stateString = (await AsyncStorage.getItem(
            this.storeName,
          )) as string;

          if (!stateString) {
            return null;
          }

          if (encryptionKey && stateString) {
            stateString = CryptoJS.AES.decrypt(stateString, encryptionKey);
            // @ts-ignore
            stateString = stateString.toString(CryptoJS.enc.Utf8);
          }

          let retrievedState = JSON.parse(stateString, reviver);

          if (includeKeys) {
            retrievedState = { ...getState(), ...retrievedState };
          } else if (excludeKeys) {
            const currentState = getState();
            excludeKeys.forEach(
              (key) => (retrievedState[key] = currentState[key]),
            );
          }
          return retrievedState;
        } catch (error) {
          throw Error.transform(error, {
            name: 'State Error',
            code: 'STORAGE_ERROR',
            message: 'Error loading from storage',
            severity: 'HIGH',
          });
        }
      },

      async save(): Promise<boolean> {
        try {
          let saveState: any = getState();

          if (includeKeys || excludeKeys) {
            const saveEntries = Object.entries(saveState).filter(([key]) =>
              includeKeys
                ? includeKeys.includes(key)
                : !excludeKeys?.includes(key),
            );

            if (!saveEntries.length) {
              return false;
            }

            saveState = Object.fromEntries(saveEntries);
          }

          let stateString = JSON.stringify(saveState, replacer);
          if (encryptionKey) {
            stateString = CryptoJS.AES.encrypt(
              stateString,
              encryptionKey,
            ).toString();
          }
          await AsyncStorage.setItem(storeName, stateString);

          return true;
        } catch (error) {
          Error.transform(error, {
            name: 'State Error',
            code: 'STORAGE_SAVE_ERROR',
            message: 'Unable to save state',
            info: { storeName },
            severity: 'HIGH',
          });

          return false;
        }
      },
    };

    if (saveOnBackground) {
      AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'background') {
          store.save();
        }
      });
    }

    return store;
  };
}
