import { useState, useEffect, useRef } from "react";
import { Comment } from "@/components";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "@/store/playbackSlice";
import { createComment } from "@/utils/apis";
import { useParams } from "react-router-dom";

const CommentSection = () => {
  const { videoId } = useParams();
  const [commenting, setcommenting] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClamped, setisClamped] = useState(true);
  const [moreButtonVisible, setmoreButtonVisible] = useState(false);

  const textRef = useRef();
  const dispatch = useDispatch();

  const { comments, status, error } = useSelector((state) => state.playback);
  const { accessToken } = useSelector((state) => state.auth);

  const commmentFilterParams = {
    // use state to implement this feature and take user input for filter params
    videoId,
    page: "1",
    limit: "10",
    sortBy: "date",
    sortType: "desc",
  };

  useEffect(() => {
    dispatch(fetchComments(commmentFilterParams));
  }, [videoId, dispatch]);

  useEffect(() => {
    if (textRef.current) {
      const div = textRef.current;
      // Check if the text is clamped
      // const condition = div.scrollHeight > div.clientHeight
      const condition = div.clientHeight > 384;
      setisClamped(condition);
      setmoreButtonVisible(condition);
    }
  }, [videoId, comments]);

  const toggleComment = () => {
    setcommentText("");
    setcommenting((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    setIsSubmitting(true);
    await createComment(videoId, commentText, accessToken)
      .then((commentData) => {
        if (commentData.success) {
          dispatch(fetchComments(commmentFilterParams));
        }
      })
      .finally(() => {
        setcommentText("");
        setIsSubmitting(false);
        setcommenting(false);
      });
  };

  return (
    <div>
      <h2 className="font-semibold text-xl my-2">{comments.length} comments</h2>
      <div className="flex">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
          // src={ownerDetails.avatar}
          alt="Profile img"
          className="size-10 rounded-full"
        />
        <input
          type="text"
          name="add-comment"
          value={commentText}
          placeholder="Add a comment"
          onClick={() => setcommenting(true)}
          onChange={(e) => setcommentText(e.target.value)}
          className="w-full h-5 py-5 px-3 ml-2 rounded-xl bg-slate-200"
        />
      </div>
      <div
        className={`flex justify-end py-2 gap-2  ${
          commenting ? "inline" : "hidden"
        }`}
      >
        <button
          onClick={toggleComment}
          className={`hover:bg-violet-200 py-2 px-3 rounded-full`}
        >
          Cancel
        </button>
        <button
          disabled={commentText.trim() === "" || isSubmitting}
          onClick={handleCommentSubmit}
          className={` ${
            commentText.trim() === ""
              ? "text-slate-100 bg-slate-300"
              : `${
                  isSubmitting
                    ? "translate-x-1 translate-y-1"
                    : "hover:bg-[#e8ebad] shadow-[5px_5px_0px_0px_#4f4e4e] active:shadow-none active:translate-x-1 active:translate-y-1"
                }  bg-[#d5d89b] text-black  transition-all duration-100 ease-in-out`
          } py-2 px-3 rounded-full font-semibold`}
        >
          {isSubmitting ? "Submitting.." : "Comment"}
        </button>
      </div>
      {/* Comments */}
      <div className="relative">
        <div
          className={`${isClamped ? "max-h-96" : "max-h-fit"} overflow-clip`}
          ref={textRef}
        >
          <div className="py-5 flex flex-col gap-2">
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setisClamped((prev) => !prev)}
          className={`${moreButtonVisible ? "" : "hidden"} ${
            isClamped
              ? "absolute pt-12 from-transparent via-white to-slate-200"
              : "static pt-0 from-transparent to-slate-200"
          }  w-full top-[300px] text-4xl text-slate-500 bg-gradient-to-b  rounded-2xl font-semibold`}
        >
          {isClamped ? (
            <IoIosArrowDown className="w-full animate-bounce" />
          ) : (
            <IoIosArrowUp className="w-full animate-up-down" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
