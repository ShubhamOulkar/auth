export interface ErrorState {
  message: string;
  status: number;
}
export default function Error({
  error,
  cssFilePath,
}: {
  error: ErrorState;
  cssFilePath?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/react.svg" type="image/x-icon" />
        <title>Server Error</title>
        <link rel="stylesheet" href={cssFilePath} type="text/css" />
      </head>
      <body>
        <div className="error-container">
          <p>Error {error.status} :</p>
          <p>{error.message}</p>
        </div>
      </body>
    </html>
  );
}
