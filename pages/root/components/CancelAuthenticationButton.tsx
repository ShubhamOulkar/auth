import React from "react";
import use2FaContext from "../2fa context/use2FaContext";
import { Link } from "react-router";

export function CancelAuthenticationButton({ buttonName }) {
  const { reset2FaContext, setFa } = use2FaContext();
  const cancle2FaAuth = () => {
    reset2FaContext();
    setFa(false);
  };
  return (
    <>
      <Link className="card-link" to="/login" onClick={cancle2FaAuth}>
        {buttonName}
      </Link>
    </>
  );
}
