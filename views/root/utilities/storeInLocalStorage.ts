import { localStorageName } from "../env";
export function storeInLocalStorage(storage: object) {
  //   const keys = Object.keys(storage);
  //   keys.map((key) => {
  //     localStorage.setItem(key, storage[key]);
  //   });

  localStorage.setItem(localStorageName, JSON.stringify(storage));
}
