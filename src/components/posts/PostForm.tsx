import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState<string>("");
  // 이미지 여러번 업로드되는 것 방지
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const t = useTranslation();

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

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    try {
      // 이미지 업로드
      let imageUrl = "";
      if (image) {
        const data = await uploadString(storageRef, image, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }
      // 업로드된 이미지의 download url 업데이트
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashtags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashtag("");
      setContent("");
      setImage(null);
      toast.success("게시물을 생성했습니다.");
      setIsSubmitting(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const onChangeHashtag = (e: any) => {
    setHashtag(e?.target?.value.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      // 스페이스바 작동 시,
      // 같은 태그 존재하면 에러
      // 아니라면 태그 생성
      if (tags?.includes(e.target.value?.trim(""))) {
        toast.error("해당 태그가 이미 존재합니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashtag] : [hashtag]));
        setHashtag("");
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((v) => v !== tag));
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        name="content"
        id="content"
        className="post-form__textarea"
        placeholder={t("POST_PLACEHOLDER")}
        required
        onChange={onChange}
        value={content}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
            <span
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => removeTag(tag)}
            >
              #{tag}
            </span>
          ))}
        </span>

        <input
          type="text"
          name="hashtag"
          id="hashtag"
          className="post-form__input"
          placeholder={t("POST_HASHTAG")}
          onChange={onChangeHashtag}
          onKeyUp={handleKeyUp}
          value={hashtag}
        />
      </div>
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
                {t("BUTTON_DELETE")}
              </button>
            </div>
          )}
        </div>

        <input
          type="submit"
          value="Tweet"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
