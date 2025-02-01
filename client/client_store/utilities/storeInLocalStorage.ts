const localStorageName = import.meta.env.VITE_LOCALSTORAGE_NAME;
export function storeInLocalStorage(storage: object): void {
  localStorage.setItem(localStorageName, JSON.stringify(storage));
}
