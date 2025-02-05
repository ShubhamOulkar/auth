import "express";

declare module "*.svg?react" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: any;
  export default content;
}

declare module "express" {
  export interface Response {
    /**
     * Sets a cookie.
     * @param name - The name of the cookie.
     * @param value - The cookie value.
     * @param options - Cookie options.
     */
    cookie(name: string, value: any, options?: CookieOptions): this;
  }
}
