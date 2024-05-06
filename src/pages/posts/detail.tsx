import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import PostHeader from "components/posts/PostHeader";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

export default function PostDetailtPage() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {post?.comments
            ?.slice(0)
            ?.reverse()
            ?.map((data: CommentProps, index: number) => (
              <CommentBox data={data} key={index} post={post} />
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
