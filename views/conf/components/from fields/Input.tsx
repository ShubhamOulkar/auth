import { useCallback, memo } from "react";
import {
  FullNameSchema,
  EmailSchema,
  GithubNameSchema,
} from "../../form validation/condingConfFormValidationSchema";
import { Error } from "./Error";
import { usePictureContext } from "../../picture context/createPictureContext";
import { Errors } from "../../type/formType";

export const Input = memo(function Input({
  type,
  label,
  name,
  submitCount,
  defaultValue,
  placeHolder,
}: {
  type: string;
  label: string;
  name: string;
  submitCount: number;
  defaultValue: string | number;
  placeHolder?: string;
}) {
  const { formErr, setFormErr } = usePictureContext();
  const validateInput = useCallback(
    validateInputField(submitCount, setFormErr),
    [submitCount]
  );

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        onChange={validateInput}
        defaultValue={defaultValue}
        placeholder={placeHolder}
      />
      <Error formErr={formErr?.[name as keyof Errors]?.[0]} />
    </>
  );
});

function validateInputField(
  submitCount: number,
  setError: React.Dispatch<React.SetStateAction<Errors>>
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitCount > 0) {
      const field = e.target.name;
      const value = e.target.value;
      const data = { [field]: value };
      let validate;

      switch (field) {
        case "fullName":
          validate = FullNameSchema.safeParse(data);
          break;
        case "email":
          validate = EmailSchema.safeParse(data);
          break;
        case "githubName":
          validate = GithubNameSchema.safeParse(data);
          break;
      }

      if (!validate?.success) {
        const error = validate?.error.flatten().fieldErrors;
        setError((prevErr) => ({ ...prevErr, ...error }));
        return;
      }

      if (validate?.success) {
        setError((prevErr) => ({ ...prevErr, [field]: undefined }));
        return;
      }
    }
  };
}
