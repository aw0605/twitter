import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { MdLogout, MdLogin } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function MenuList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className="footer__grid">
        <button className="" type="button" onClick={() => navigate("/")}>
          <BsHouse />
          Home
        </button>
        <button className="" type="button" onClick={() => navigate("/profile")}>
          <FaUserCircle />
          Profile
        </button>
        <button className="" type="button" onClick={() => navigate("/search")}>
          <FaSearch />
          Search
        </button>
        {user === null ? (
          <button
            className=""
            type="button"
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            Login
          </button>
        ) : (
          <button
            className=""
            type="button"
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success("로그아웃 되었습니다.");
            }}
          >
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
