export function storeInLocalStorage(storage: object) {
  //   const keys = Object.keys(storage);
  //   keys.map((key) => {
  //     localStorage.setItem(key, storage[key]);
  //   });

  localStorage.setItem("auth_ssr_user", JSON.stringify(storage));
}
