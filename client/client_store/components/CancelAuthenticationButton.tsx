import use2FaContext from "../2fa context/use2FaContext";

export function CancelAuthenticationButton({
  buttonName,
}: {
  buttonName: string;
}) {
  const { reset2FaContext } = use2FaContext();
  const cancle2FaAuth = () => {
    reset2FaContext();
  };
  return (
    <>
      <a className="card-link" href="/login" onClick={cancle2FaAuth}>
        {buttonName}
      </a>
    </>
  );
}
