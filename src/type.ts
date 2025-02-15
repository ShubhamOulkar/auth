import { TokenPayload } from "google-auth-library";
import { RenderToPipeableStreamOptions } from "react-dom/server";
export interface Payload {
  id: string;
  iat: number;
  sessionId?: string;
}

export interface SessionDecryptOptions {
  issuer: string | undefined;
  audience: string | undefined;
  subject: string | undefined;
}

export interface ErrorState {
  message: string;
  status: number;
}

export interface User {
  googleVerified: boolean;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  googleSub: string | undefined;
  password: "googleStorage";
  confirmPassword: "false";
  payload?: TokenPayload;
}

export interface ErrorHandler {
  message: string;
  errorCode?: number;
  stack: string;
}

export interface Render {
  url: string;
  options: RenderToPipeableStreamOptions;
}
