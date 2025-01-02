import { RefObject } from "react";

export interface InitialState {
  success: boolean;
  data: {
    picture: any;
    fullName: string;
    email: string;
    githubName: string;
  };
  submitCount: number;
}

export type Errors =
  | {
      picture?: string[] | undefined;
      fullName?: string[] | undefined;
      email?: string[] | undefined;
      githubName?: string[] | undefined;
    }
  | undefined;

export type StopEvent = {
  dataTransfer?: any;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export type DnDType = {
  setPicture: React.Dispatch<React.SetStateAction<string>>;
  inputFileRef: RefObject<HTMLInputElement | null>;
  resetPicture: () => void;
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>;
};

export type HandleDropHandlerType = StopEvent & DnDType;

export type UserType = {
  picture: string;
  fullName: string;
  email: string;
  githubName: string;
};

export type PictureContext = {
  userData: UserType;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
  resetPicture: () => void;
  formErr: Errors;
  setFormErr: React.Dispatch<React.SetStateAction<Errors>>;
  inputFileRef: React.RefObject<HTMLInputElement | null>;
  previewRef: React.RefObject<HTMLImageElement | null>;
  pictureUpload: boolean;
  setPictureUpload: React.Dispatch<React.SetStateAction<boolean>>;
};
