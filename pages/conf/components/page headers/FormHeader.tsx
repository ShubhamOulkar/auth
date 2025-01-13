import LogoFull from "../../assets/images/logo-full.svg?url";

export default function FormHeader() {
  return (
    <>
      <img className="logo-full" src={LogoFull} />
      <h1>
        Your Journey to Coding Conf <br />
        2025 Starts Here!
        <sub>Secure your spot at next year's biggest coding conference.</sub>
      </h1>
    </>
  );
}
