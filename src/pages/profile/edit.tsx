import { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { storage } from "firebaseApp";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PostHeader from "components/posts/PostHeader";
import { FiImage } from "react-icons/fi";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

export default function ProfileEditPage() {
  const [displayName, setDisplayName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImage(result);
    };
  };

  const handleDeleteImg = () => {
    setImage(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;

    try {
      // 기존 유저 이미지가 firebase storage 이미지인 경우에만 삭제
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
      ) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch((e) => console.log(e));
        }
      }
      // 이미지 업로드
      if (image) {
        const data = await uploadString(storageRef, image, "data_url");
        newImageUrl = await getDownloadURL(data?.ref);
      }
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageUrl || "",
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다.");
            navigate("/profile");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImage(user?.photoURL);
    }
    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user?.photoURL, user?.displayName]);

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            value={displayName}
            onChange={onChange}
          />
          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
              </label>
              <input
                type="file"
                name="file-input"
                id="file-input"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {image && (
                <div className="post-form__attachment">
                  <img src={image} alt="attachment" width={100} height={100} />
                  <button
                    className="post-form__clear-btn"
                    type="button"
                    onClick={handleDeleteImg}
                  >
                    Clear
                  </button>
                </div>
              )}
              <input
                type="submit"
                value="프로필 수정"
                className="post-form__submit-btn"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
