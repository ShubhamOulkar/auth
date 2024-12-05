export function storeInLocalStorage(storage: object) {
  //   const keys = Object.keys(storage);
  //   keys.map((key) => {
  //     localStorage.setItem(key, storage[key]);
  //   });

  localStorage.setItem(
    import.meta.env.VITE_LOCALSTORAGE_NAME,
    JSON.stringify(storage)
  );
}
