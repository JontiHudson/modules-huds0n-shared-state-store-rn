</p>

<h2 align="center">@huds0n/shared-state-store-rn</h3>

</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/JontiHudson/modules-huds0n-shared-state-store-rn.svg)](https://github.com/JontiHudson/modules-huds0n-shared-state-store-rn/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/JontiHudson/modules-huds0n-shared-state-store-rn.svg)](https://github.com/JontiHudson/modules-huds0n-shared-state-store-rn/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"><p align="center">Add state persisting to <b>@huds0n/shared-state</b> using <b>@react-native-async-storage/async-storage</b>
</p>

</br>

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting_started)
- [Usage](#usage)
  - [Persisting a Shared State](#persist)
- [Reference](#reference)
  - [Store Options](#reference_store-options)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

</br>

## 🧐 About <a name = "about"></a>

Add state persisting to **React Native** projects using the [@huds0n/shared-state](https://github.com/JontiHudson/modules-huds0n-shared-state) module.

</br>

## ✅ List of Features <a name = "features"></a>

- **Quick:** _Initialize a store in a single line._
- **Secure:** _Built in AES encryption._
- **Specific:** _Use include/exclude keys to specify which props to save._
- **Automatic:** _Have state save on background or after change._

</br>

## 🏁 Getting Started <a name = "getting_started"></a>

### **Prerequisites**

Requires [huds0n/shared-state](https://github.com/JontiHudson/modules-huds0n-shared-state) and [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage).

</br>

### **Installing**

```
npm i @huds0n/shared-state-store-rn
```

</br>

## 🧑‍💻 Usage <a name="usage"></a>

### **Persist a Shared State**<a name="persist"></a>

```js
import { SharedState } from "@huds0n/shared-state";

const ExampleState = new SharedState({
  username: null,
  password: null
  ...ect
});

ExampleState.initializeStorage(
  createStoreRN(storeOptions),
);
```

_Returns a promise that resolve with true/false depending on success.</br>See reference for [storeOptions](#reference_store_options)._

</br>

## 📖 Reference <a name="reference"></a>

### **Store Options**<a name="reference_store_options"></a>

| Prop              | Required/(_Default_) | Description                                                                                    | Type                                   |
| ----------------- | :------------------: | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| encryptionKey     |          -           | AES encryption string</br>Storage unencrypted if undefined                                     | _string_                               |
| excludeKeys       |          -           | List of state props not to save                                                                | array of _state keys_                  |
| includeKeys       |          -           | List of state props to save</br>All other state props skipped</br>Overrides _excludeKeys_ prop | array of _state keys_                  |
| replacer          |          -           | Replacer function used in stringifing the save state                                           | (key: _string_, value: _any_) => _any_ |
| reviver           |          -           | Reviver function used in parse the save state                                                  | (key: _string_, value: _any_) => _any_ |
| saveOnBackground  |        false         | Saves state automatically when app is backgrounded                                             | _boolean_                              |
| saveAutomatically |        false         | Saves state automatically whenever state changes                                               | _boolean_                              |
| storeName         |          ✔           | name of store                                                                                  | _string_                               |

</br>

## ✍️ Authors <a name = "authors"></a>

- [@JontiHudson](https://github.com/JontiHudson) - Idea & Initial work
- [@MartinHudson](https://github.com/martinhudson) - Support & Development

See also the list of [contributors](https://github.com/JontiHudson/modules-huds0n-shared-state-store-rn/contributors) who participated in this project.

</br>

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Special thanks to my fiance, Arma, who has been so patient with all my extra-curricular work.
