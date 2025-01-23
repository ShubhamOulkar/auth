import { Link } from "react-router";
import useAuthContext from "../auth context/useAuthContext";
import { ProfileCard } from "../components/ComponentExpoter";

function ProfilePage() {
  const { auth, user } = useAuthContext();

  if (auth === null) {
    return <h1>Skeleton</h1>;
  }

  return (
    <>
      {auth ? (
        <ProfileCard user={user} />
      ) : (
        <p>
          User is not authenticated. <Link to="/login">Login</Link>
        </p>
      )}
    </>
  );
}

export default ProfilePage;
