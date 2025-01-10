import { ChangeEvent, RefObject } from "react";
import { StopEvent } from "../../type/formType";
import { ImageSchema } from "../../form validation/condingConfFormValidationSchema";
import { SafeParseReturnType } from "zod";
import { Errors } from "../../type/formType";
import UploadImageIcon from "../../assets/images/icon-upload.svg";

const stopEvent = (e: StopEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const stateUpdater = (
  validate: SafeParseReturnType<{ picture?: any }, { picture?: any }>,
  resetPicture: () => void,
  imageFiles: FileList,
  inputFileRef: RefObject<HTMLInputElement | null>,
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>,
  previewRef: RefObject<HTMLImageElement | null>,
  setPictureUpload: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!validate.success) {
    const picErr = validate.error.flatten().fieldErrors.picture;
    resetPicture();
    setFormErr((prevErr) => ({ ...prevErr, picture: picErr }));
    if (previewRef.current) {
      previewRef.current.src = UploadImageIcon;
      setPictureUpload(false);
    }
  } else {
    setFormErr((prevErr) => ({ ...prevErr, picture: undefined }));
    if (inputFileRef.current && previewRef.current) {
      inputFileRef.current.files = imageFiles;
      previewRef.current.src = URL.createObjectURL(imageFiles[0]);
      setPictureUpload(true);
    }
  }
};

const handleClick = (
  e: StopEvent,
  inputFileRef: RefObject<HTMLInputElement | null>
) => {
  e.stopPropagation();
  inputFileRef.current?.click();
};

const handleDrop = (
  e: StopEvent,
  inputFileRef: RefObject<HTMLInputElement | null>,
  resetPicture: () => void,
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>,
  previewRef: RefObject<HTMLImageElement | null>,
  setPictureUpload: React.Dispatch<React.SetStateAction<boolean>>
) => {
  stopEvent(e);
  const imageFiles = e.dataTransfer.files; // dataTransfer holds data files during drag and drop events
  const validate = ImageSchema.safeParse({ picture: imageFiles });
  stateUpdater(
    validate,
    resetPicture,
    imageFiles,
    inputFileRef,
    setFormErr,
    previewRef,
    setPictureUpload
  );
};

const handleFileChange = (
  e: ChangeEvent<HTMLInputElement>,
  inputFileRef: RefObject<HTMLInputElement | null>,
  resetPicture: () => void,
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>,
  previewRef: RefObject<HTMLImageElement | null>,
  setPictureUpload: React.Dispatch<React.SetStateAction<boolean>>
) => {
  stopEvent(e);
  const imageFiles = e.target.files as FileList;
  const validate = ImageSchema.safeParse({ picture: imageFiles });
  stateUpdater(
    validate,
    resetPicture,
    imageFiles,
    inputFileRef,
    setFormErr,
    previewRef,
    setPictureUpload
  );
};

export { stopEvent, handleClick, handleDrop, handleFileChange };
