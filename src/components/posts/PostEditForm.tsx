import { useCallback, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { db, storage } from "firebaseApp";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "context/AuthContext";
import { PostProps } from "pages/home";
import { FiImage } from "react-icons/fi";
import PostHeader from "./PostHeader";
import useTranslation from "hooks/useTranslation";

export default function PostEditForm() {
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  const t = useTranslation();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashtags);
      setImage(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

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

    try {
      if (post) {
        // 기존 사진 삭제 후
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((e) => console.log(e));
        }

        // 새로운 사진 업로드
        let imageUrl = "";
        if (image) {
          const key = `${user?.uid}/${uuidv4()}`;
          const storageRef = ref(storage, key);
          const data = await uploadString(storageRef, image, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }

        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          hashtags: tags,
          imageUrl: imageUrl,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시물을 수정했습니다.");
        setImage(null);
        setIsSubmitting(false);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: any) => {
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

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          name="content"
          id="content"
          className="post-form__textarea"
          placeholder="What is happening?"
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
            placeholder="해시태그 + 스페이스바 입력"
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
                  Clear
                </button>
              </div>
            )}
          </div>
          <input
            type="submit"
            value={t("BUTTON_EDIT")}
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
