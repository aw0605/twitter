import { FiImage } from "react-icons/fi";

export default function PostForm() {
  const handleFileUpload = () => {};
  return (
    <form className="post-form">
      <textarea
        name="content"
        id="content"
        className="post-form__textarea"
        placeholder="What is happening?"
        required
      />
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
        <input type="submit" value="Tweet" className="post-form__submit-btn" />
      </div>
    </form>
  );
}
