import UploadImageIcon from "../../assets/images/icon-upload.svg";
import { usePictureContext } from "../../picture context/createPictureContext";
import { StopEvent } from "../../type/formType";

export function DnDbutton() {
  const { inputFileRef, previewRef, setPictureUpload } = usePictureContext();
  const removePicture = (e: StopEvent) => {
    e.preventDefault();
    if (inputFileRef.current && previewRef.current) {
      previewRef.current.src = UploadImageIcon;
      setPictureUpload(false);
    }
    e.stopPropagation();
  };

  const changePicture = (e: StopEvent) => {
    e.preventDefault();
    inputFileRef.current?.click();
    e.stopPropagation();
  };
  return (
    <div className="dnd-btn-container">
      <button className="dnd-btn" onClick={removePicture}>
        Remove
      </button>
      <button className="dnd-btn" onClick={changePicture}>
        Change
      </button>
    </div>
  );
}
