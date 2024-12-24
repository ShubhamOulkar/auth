import React from "react";

function Spinner() {
  return (
    <div className="spinner">
      <img src="/client/assets/spinner.svg" />
      <p>
        <strong>Wait ✋🏻... connecting to the server.</strong>
      </p>
    </div>
  );
}

export default Spinner;
