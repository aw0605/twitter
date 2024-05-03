import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function PostHeader() {
  const navigate = useNavigate();

  return (
    <div className="post__header">
      <button type="button" onClick={() => navigate(-1)}>
        <IoIosArrowBack className="post__header-btn" />
      </button>
    </div>
  );
}
