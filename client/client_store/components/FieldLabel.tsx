import use2FaContext from "../2fa context/use2FaContext";
import Timer from "./Timer";
function Label({
  label,
  labelFor,
  error,
}: {
  label: string;
  labelFor: string;
  error: string;
}) {
  const labels = ["confirmPassword", "password"];
  const { timerStatus } = use2FaContext();
  const id = `${labelFor}Err`;
  return (
    <label htmlFor={labelFor}>
      {label} {timerStatus && !labels.includes(labelFor) ? <Timer /> : ""}
      {error && (
        <span className="error" id={id} aria-live="assertive">
          {error}
        </span>
      )}
    </label>
  );
}

export default Label;
