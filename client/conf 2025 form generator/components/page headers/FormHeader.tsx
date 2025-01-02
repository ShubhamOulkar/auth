import React from "react";
import LogoFull from "../../../assets/images/logo-full.svg?react";

export default function FormHeader() {
  return (
    <>
      <LogoFull className="logo-full" stroke="black" />
      <h1>
        Your Journey to Coding Conf <br />
        2025 Starts Here!
        <sub>Secure your spot at next year's biggest coding conference.</sub>
      </h1>
    </>
  );
}
