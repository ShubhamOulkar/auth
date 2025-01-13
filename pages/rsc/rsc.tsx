export async function Rsc() {
  let cond = false;
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve((cond = true));
    }, 1 * 50 * 1000)
  );

  return <p>{cond && "RSC"}</p>;
}
