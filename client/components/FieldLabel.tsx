import React from "react";

type FieldLabelType = {
  label: string;
  labelFor: string;
};

function Label({ label, labelFor, errorsObj }) {
  let errId = `${labelFor}Err`;
  let ifError = errorsObj[labelFor];
  return (
    <label htmlFor={labelFor}>
      {label}
      {ifError && (
        <span className="error" id={errId} aria-live="assertive">
          {" "}
          {ifError?.message}
        </span>
      )}
    </label>
  );
}

export default Label;
