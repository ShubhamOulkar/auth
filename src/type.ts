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
