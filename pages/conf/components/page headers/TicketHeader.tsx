import React from "react";
import { usePictureContext } from "../../picture context/createPictureContext";
import LogoFull from "../../assets/images/logo-full.svg?react";

export default function TicketHeader() {
  const { userData } = usePictureContext();
  return (
    <>
      <LogoFull className="logo-full" stroke="black" />
      <h1>
        <span>
          Congrats, <span className="gradient">{userData.fullName}!</span>{" "}
          <br />
          Your ticket is ready.
        </span>
        <sub>
          We've emailed your ticket to <br />
          <span className="gradient">{userData.email}</span> and will send
          updates in <br /> the run up to the event.
        </sub>
      </h1>
    </>
  );
}
