import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import PostHeader from "components/posts/PostHeader";

export default function PostDetailtPage() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  );
}
