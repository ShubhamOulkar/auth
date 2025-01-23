function Label({
  label,
  labelFor,
  error,
}: {
  label: string;
  labelFor: string;
  error: string;
}) {
  const id = `${labelFor}Err`;
  return (
    <label htmlFor={labelFor}>
      {label}
      {error && (
        <span className="error" id={id} aria-live="assertive">
          {error}
        </span>
      )}
    </label>
  );
}

export default Label;
