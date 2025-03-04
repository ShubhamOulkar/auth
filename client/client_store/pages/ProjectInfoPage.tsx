import React from "react";
import { Trans } from "@lingui/react/macro";
import { SiWebauthn } from "react-icons/si";

export default function ProjectInfoPage() {
  return (
    <div className="card center-card">
      <h1>
        <Trans>Identity and access management system</Trans>
      </h1>
      <SiWebauthn size={50} />
      <p>
        <Trans>Developer Shubham Oulkar</Trans>
      </p>
    </div>
  );
}
