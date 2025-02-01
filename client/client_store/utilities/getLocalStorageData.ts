import { UserType } from "../types/userType";
const localStorageName = import.meta.env.VITE_LOCALSTORAGE_NAME;
export function getLocalStorageData(): UserType {
  const storageString = localStorage.getItem(localStorageName) || "";
  const userObject: UserType = storageString && JSON.parse(storageString);
  return userObject;
}
