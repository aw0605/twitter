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
          <span className="footer__grid--text">{t("MENU_HOME")}</span>
        </button>
        <button className="" type="button" onClick={() => navigate("/profile")}>
          <FaUserCircle />
          <span className="footer__grid--text">{t("MENU_PROFILE")}</span>
        </button>
        <button className="" type="button" onClick={() => navigate("/search")}>
          <FaSearch />
          <span className="footer__grid--text">{t("MENU_SEARCH")}</span>
        </button>
        <button
          className=""
          type="button"
          onClick={() => navigate("/notifications")}
        >
          <MdNotificationsNone />
          <span className="footer__grid--text">{t("MENU_NOTI")}</span>
        </button>
        {user === null ? (
          <button
            className=""
            type="button"
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            <span className="footer__grid--text">{t("MENU_LOGIN")}</span>
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
            <span className="footer__grid--text">{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
