import React from "react";

function Label({ label, labelFor, error }) {
  const id = `${labelFor}Err`;
  return (
    <label htmlFor={labelFor}>
      {label}
      {error && (
        <span className="error" id={id} aria-live="assertive">
          {error}
        </span>
      )}
    </label>
  );
}

export default Label;
