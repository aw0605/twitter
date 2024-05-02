import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PostProps } from "pages/home";
import { FiImage } from "react-icons/fi";

export default function PostEditForm() {
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState<string>("");
  const params = useParams();
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashtags);
    }
  }, [params.id]);

  const handleFileUpload = () => {};

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          hashtags: tags,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시물을 수정했습니다.");
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
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>
  );
}