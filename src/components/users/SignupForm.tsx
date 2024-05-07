import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const t = useTranslation();

  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name },
    } = e;

    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }
    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GoogleAuthProvider | GithubAuthProvider
    )
      .then((result) => {
        console.log(result);
        toast.success("로그인 되었습니다.");
      })
      .catch((e) => {
        console.log(e);
        const errorMessage = e?.meesage;
        toast?.error(errorMessage);
      });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("회원가입에 성공했습니다.");
    } catch (e: any) {
      toast.error(e?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== passwordConfirm) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }

    if (name === "password_confirm") {
      setPasswordConfirm(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }
  };

  return (
    <form className="form form__lg" onSubmit={onSubmit}>
      <div className="form__title">{t("MENU_SIGNUP")}</div>
      <div className="form__block">
        <label htmlFor="email">{t("FORM_EMAIL")}</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          required
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">{t("FORM_PASSWORD")}</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          required
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password_confirm">{t("FORM_PASSWORD_CHECK")}</label>
        <input
          type="password"
          name="password_confirm"
          id="password_confirm"
          value={passwordConfirm}
          required
          onChange={onChange}
        />
      </div>

      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}

      <div className="form__block">
        {t("YES_ACCOUNT")}
        <Link to="/users/login" className="form__link">
          {t("SIGNIN_LINK")}
        </Link>
      </div>
      <div className="form__block--lg">
        <button
          type="submit"
          className="form__btn--submit"
          disabled={error?.length > 0}
        >
          {t("MENU_SIGNUP")}
        </button>
      </div>
      <div className="form__block--lg">
        <button
          type="button"
          name="google"
          className="form__btn--google"
          onClick={onClickSocialLogin}
        >
          {t("SIGNUP_GOOGLE")}
        </button>
      </div>
      <div className="form__block--lg">
        <button
          type="button"
          name="github"
          className="form__btn--github"
          onClick={onClickSocialLogin}
        >
          {t("SIGNUP_GITHUB")}
        </button>
      </div>
    </form>
  );
}
