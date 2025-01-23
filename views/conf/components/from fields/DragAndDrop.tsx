import React from "react";
import { usePictureContext } from "../../picture context/createPictureContext";
import {
  stopEvent,
  handleClick,
  handleDrop,
  handleFileChange,
} from "./dragAndDropHandlers";
import { Error } from "./Error";
import { Errors } from "../../type/formType";
import UploadImageIcon from "../../assets/images/icon-upload.svg?url";
import { DnDbutton } from "./DnDbutton";
import { ChangeEvent } from "react";

export default function DragAndDrop({ name }: { name: string }) {
  const {
    pictureUpload,
    setPictureUpload,
    resetPicture,
    formErr,
    setFormErr,
    inputFileRef,
    previewRef,
  } = usePictureContext();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrop(
      e,
      inputFileRef,
      resetPicture,
      setFormErr,
      previewRef,
      setPictureUpload
    );
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleClick(e, inputFileRef);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e,
      inputFileRef,
      resetPicture,
      setFormErr,
      previewRef,
      setPictureUpload
    );
  };

  return (
    <>
      <label htmlFor="imageFile">Upload Avatar</label>
      <div
        className="dnd-target"
        onDragOver={stopEvent}
        onDrop={onDrop}
        onClick={onClick}
        tabIndex={0}
      >
        <img
          className="preview-picture"
          alt="preview"
          src={UploadImageIcon}
          ref={previewRef}
        />
        {pictureUpload ? <DnDbutton /> : "Drag and drop or click to upload"}
        <input
          id="imageFile"
          name={name}
          hidden
          type="file"
          accept="image/png, image/jpeg"
          ref={inputFileRef}
          onChange={onChange}
        />
      </div>
      <Error formErr={formErr?.["picture" as keyof Errors]?.[0]} />
    </>
  );
}
