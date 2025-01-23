import { usePictureContext } from "../picture context/createPictureContext";
import Logo from "../assets/images/logo-mark.svg?react";
import GithubLogo from "../assets/images/icon-github.svg?react";

export default function Ticket() {
  const { userData } = usePictureContext();
  return (
    <div className="ticket-background">
      <div className="ticket">
        <Logo />
        <h2 className="ticket-sub">
          Coding Conf<sub>Jan 31, 2025 / Austin, TX</sub>
        </h2>
      </div>
      <div className="ticket">
        <img src={userData.picture} alt="avatar" />
        <h3 className="ticket-sub">
          {userData.fullName}
          <sub>
            <GithubLogo />
            {userData.githubName}
          </sub>
        </h3>
      </div>
    </div>
  );
}
