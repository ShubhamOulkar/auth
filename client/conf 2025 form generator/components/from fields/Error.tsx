import IconInfo from "../../../assets/images/icon-info.svg?react";
import React from "react";

export function Error({ formErr }: { formErr: string | undefined }) {
  return (
    <div className="error">
      {formErr && (
        <>
          <IconInfo /> {formErr}
        </>
      )}
    </div>
  );
}
