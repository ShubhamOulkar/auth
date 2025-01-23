import { InitialState } from "../type/formType";
import { CondingConfFormSchema } from "../form validation/condingConfFormValidationSchema";
import { Errors, UserType } from "../type/formType";
import UploadImageIcon from "../assets/images/icon-upload.svg";

export const action = (
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>,
  resetPicture: () => void,
  previewRef: React.RefObject<HTMLImageElement | null>,
  setUserData: React.Dispatch<React.SetStateAction<UserType>>,
  setPictureUpload: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (previousState: InitialState, formData: FormData) => {
    const submitCount = previousState.submitCount + 1;
    const data = getDataForValidation(formData);
    const validate = CondingConfFormSchema.safeParse(data);
    if (validate.success) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
      setFormErr(undefined); //set field errors undefined
      setUserData({
        // set user context for ticket generation
        picture: URL.createObjectURL(data.picture[0]),
        fullName: data.fullName,
        email: data.email,
        githubName: data.githubName,
      });
      return {
        success: true,
        data: {
          picture: null,
          fullName: "",
          email: "",
          githubName: "",
        },
        submitCount: 0,
      };
    }

    // on form invalid
    if (previewRef.current) previewRef.current.src = UploadImageIcon; // remove preview
    resetPicture(); // reset picture context
    setFormErr(validate.error.flatten().fieldErrors); // set error fields
    setPictureUpload(false);
    return {
      success: false,
      data: data,
      submitCount,
    };
  };
};

function getPictureData(file: any) {
  if (!file.size) {
    return []; // zod will return error if file is not selected
  }
  return [file]; // get() return File object but validation needs FileList, so converted into array file
}

function getDataForValidation(formData: FormData) {
  return {
    picture: getPictureData(formData.get("picture")),
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    githubName: formData.get("githubName") as string,
  };
}
