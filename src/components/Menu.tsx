import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { MdLogout, MdLogin, MdNotificationsNone } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const t = useTranslation();

  return (
    <div className="footer">
      <div className="footer__grid">
        <button className="" type="button" onClick={() => navigate("/")}>
          <BsHouse />
          {t("MENU_HOME")}
        </button>
        <button className="" type="button" onClick={() => navigate("/profile")}>
          <FaUserCircle />
          {t("MENU_PROFILE")}
        </button>
        <button className="" type="button" onClick={() => navigate("/search")}>
          <FaSearch />
          {t("MENU_SEARCH")}
        </button>
        <button
          className=""
          type="button"
          onClick={() => navigate("/notifications")}
        >
          <MdNotificationsNone />
          {t("MENU_NOTI")}
        </button>
        {user === null ? (
          <button
            className=""
            type="button"
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            {t("MENU_LOGIN")}
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
            {t("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}
