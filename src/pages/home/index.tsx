import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";
export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCounts?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-04-26",
    uid: "111111",
  },
  {
    id: "2",
    email: "test2@test.com",
    content: "내용2",
    createdAt: "2024-04-27",
    uid: "222222",
  },
  {
    id: "3",
    email: "test3@test.com",
    content: "내용3",
    createdAt: "2024-04-28",
    uid: "333333",
  },
  {
    id: "4",
    email: "test4@test.com",
    content: "내용4",
    createdAt: "2024-04-29",
    uid: "444444",
  },
  {
    id: "5",
    email: "test@4test.com",
    content: "내용5",
    createdAt: "2024-04-30",
    uid: "444444",
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab">Following</div>
      </div>
      {/* post form */}
      <PostForm />

      {/* Tweet posts */}
      <div className="post">
        {posts?.map((post) => (
          <PostBox post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
