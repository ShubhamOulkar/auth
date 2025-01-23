import { PiUserCircleGearBold } from "react-icons/pi";
import { MotherBtn } from "../components/ComponentExpoter";
import { UserType } from "../types/userType";

function ProfileCard({ user }: { user: UserType }) {
  return (
    <div className="card profile-card">
      <h1>User Profile</h1>
      {user?.picture ? (
        <img
          className="navprofile"
          src={user?.picture}
          alt={`${user?.email} picture`}
        />
      ) : (
        <PiUserCircleGearBold width={100} height={100} />
      )}
      <p>Name: {user?.first}</p>
      <p>Surname: {user?.last}</p>
      <p>Email: {user?.email}</p>
      <MotherBtn btnName="Delete user" />
    </div>
  );
}

export default ProfileCard;
