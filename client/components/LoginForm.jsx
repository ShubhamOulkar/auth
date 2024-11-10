import { useState } from "react";

function LoginForm() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h5>login form</h5>
      <form>
        <input type="text" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
