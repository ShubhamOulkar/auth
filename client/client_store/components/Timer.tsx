import { useEffect, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(60);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return (
    <span style={{ color: "red", marginInline: "1rem" }}>
      {" "}
      {"  "}otp expires in {time} sec.
    </span>
  );
}
