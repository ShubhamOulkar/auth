declare module "./db/dbUtils.js" {
  export function connectMongo(): Promise<void>;
}
