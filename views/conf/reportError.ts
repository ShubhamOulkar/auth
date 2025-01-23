function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  if (errorTitle) {
    errorTitle.innerText = title;
  }

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  if (errorMessage) {
    errorMessage.innerText = heading;
  }
  if (errorBody) {
    if (body) {
      errorBody.innerText = body;
    } else {
      errorBody.innerText = "";
    }
  }

  // Display component stack
  if (errorComponentStack) {
    errorComponentStack.innerText = componentStack;
  }

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  if (errorStack) {
    errorStack.innerText = error.stack
      .replace(error.message, "")
      .split(/\n(.*)/s)[1];
  }

  // Display the cause, if available
  if (error.cause) {
    if (errorCauseMessage) {
      errorCauseMessage.innerText = error.cause.message;
    }
    if (errorCauseStack) {
      errorCauseStack.innerText = error.cause.stack;
    }
    if (errorCause) {
      errorCause.classList.remove("hidden");
    }
  } else {
    if (errorCause) {
      errorCause.classList.add("hidden");
    }
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible?.classList.add("hidden");
    errorClose?.classList.remove("hidden");
  } else {
    errorNotDismissible?.classList.remove("hidden");
    errorClose?.classList.add("hidden");
  }

  // Show the dialog
  errorDialog?.classList.remove("hidden");
}

export function reportCaughtError({ error, cause, componentStack }) {
  reportError({
    title: "Caught Error",
    error,
    componentStack,
    dismissable: true,
  });
}

export function reportUncaughtError({ error, cause, componentStack }) {
  reportError({
    title: "Uncaught Error",
    error,
    componentStack,
    dismissable: false,
  });
}

export function reportRecoverableError({ error, cause, componentStack }) {
  reportError({
    title: "Recoverable Error",
    error,
    componentStack,
    dismissable: true,
  });
}
