import { JSX } from "react";
import { BiHide, BiShow } from "react-icons/bi";

/**
 * A component that toggles the visibility of a password input field.
 *
 * @param {React.RefObject<HTMLInputElement>} props.refInput - A reference to the password input field.
 * @returns {JSX.Element} A button that toggles the visibility of the password input field.
 */
export default function TogglePasswordBtn({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  /**
   * Toggles the visibility of the password input field.
   */

  const togglePasswordVisibility = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
    setShowPassword(!showPassword);
  };

  return (
    <button
      type="button"
      className="show-btn"
      onClick={togglePasswordVisibility}
      aria-label="Show password"
      aria-pressed={showPassword}
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <BiHide /> : <BiShow />}
    </button>
  );
}
