import { Input } from "../from fields/Input";
import { useNavigate } from "react-router";
import { useActionState, useEffect } from "react";
import { action } from "../../form action/codingConfFormAction";
import { InitialState } from "../../type/formType";
import DragAndDrop from "../from fields/DragAndDrop";
import { usePictureContext } from "../../picture context/createPictureContext";
import SkeConf from "./Skeleton";

export default function CodingConfForm() {
  const navigate = useNavigate();
  const {
    setUserData,
    setFormErr,
    resetPicture,
    previewRef,
    setPictureUpload,
  } = usePictureContext();
  const initialState: InitialState = {
    success: false,
    data: {
      picture: null,
      fullName: "",
      email: "",
      githubName: "",
    },
    submitCount: 0,
  };
  const [formState, formAction, isPending] = useActionState(
    action(setFormErr, resetPicture, previewRef, setUserData, setPictureUpload),
    initialState
  );

  useEffect(() => {
    if (formState.success) {
      // navigate to ticket
      navigate("/conf/ticket");
    }
  }, [formState.success, navigate]);

  if (isPending) {
    return <SkeConf />;
  }

  return (
    <form action={formAction}>
      <DragAndDrop name="picture" />
      <Input
        type="text"
        label="Full Name"
        name="fullName"
        submitCount={formState.submitCount}
        defaultValue={formState.data.fullName}
      />
      <Input
        type="email"
        label="Email Address"
        name="email"
        submitCount={formState.submitCount}
        placeHolder="example@email.com"
        defaultValue={formState.data.email}
      />
      <Input
        type="text"
        label="GitHub Username "
        name="githubName"
        submitCount={formState.submitCount}
        placeHolder="@yourusername"
        defaultValue={formState.data.githubName}
      />
      <button type="submit">Generate My Ticket</button>
    </form>
  );
}
