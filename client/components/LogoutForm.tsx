import React from "react";
import { useState } from "react";

function LogoutForm() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h5>logout form</h5>
      <form>
        <input type="text" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default LogoutForm;
