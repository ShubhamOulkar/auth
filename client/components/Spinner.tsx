import React from "react";

function Spinner() {
  return (
    <div className="spinner">
      <img src="/client/assets/spinner.svg" />
      <p>
        <strong>Wait, I am doing user verification ✋🏻...</strong>
      </p>
    </div>
  );
}

export default Spinner;
