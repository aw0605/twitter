import HomePage from "pages/home";
import LoginPage from "pages/login";
import NotificationPage from "pages/notifications";
import PostListPage from "pages/posts";
import PostDetailtPage from "pages/posts/detail";
import PostEditPage from "pages/posts/edit";
import PostNewPage from "pages/posts/new";
import ProfilePage from "pages/profile";
import ProfileEditPage from "pages/profile/edit";
import SearchPage from "pages/search";
import SignUpPage from "pages/signup";
import { Navigate, Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostListPage />} />
      <Route path="/posts/:id" element={<PostDetailtPage />} />
      <Route path="/posts/new" element={<PostNewPage />} />
      <Route path="/posts/edit/:id" element={<PostEditPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
