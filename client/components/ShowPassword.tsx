import React, { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

/**
 * A component that toggles the visibility of a password input field.
 *
 * @param {object} props
 * @param {React.RefObject<HTMLInputElement>} props.refInput - A reference to the password input field.
 * @returns {JSX.Element} A button that toggles the visibility of the password input field.
 */
export default function ShowPassword({ refInput }) {
  const [showPass, setShowPass] = useState(false);

  /**
   * Toggles the visibility of the password input field.
   */
  const togglePasswordVisibility = () => {
    const inputField = refInput.current;
    inputField.type = inputField.type === "password" ? "text" : "password";
    setShowPass(!showPass);
  };

  return (
    <div
      className="show-btn"
      onClick={togglePasswordVisibility}
      aria-label="Show password"
      aria-pressed={showPass}
    >
      {showPass ? (
        <BiShow width={16} height={16} />
      ) : (
        <BiHide width={16} height={16} />
      )}
    </div>
  );
}