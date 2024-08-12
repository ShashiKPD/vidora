import { formatDateToNow } from "@/utils/helper";
import { useEffect, useRef, useState } from "react";
import { deleteComment } from "@/utils/apis";

import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoArrowRedo } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeComment } from "@/store/playbackSlice";

const Comment = (comment) => {
  const { _id, content, likeCount, owner, updatedAt } = comment.comment;
  const [isOwner, setIsOwner] = useState(false);
  const [isClamped, setisClamped] = useState(true);
  const [liked, setLiked] = useState(false);
  const [moreButtonVisible, setmoreButtonVisible] = useState(false);
  const [isOptionBoxOpen, setIsOptionBoxOpen] = useState(false);

  const textRef = useRef();
  const dispatch = useDispatch();
  const formattedDate = formatDateToNow(updatedAt);
  const { accessToken, userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (textRef.current) {
      const div = textRef.current;
      // Check if the text is clamped
      setisClamped(div.scrollHeight - div.clientHeight > 2);
      setmoreButtonVisible(div.scrollHeight - div.clientHeight > 2);
    }

    if (owner.username === userData.username) {
      setIsOwner(true);
    }
  }, []);

  const handleDelete = async () => {
    setIsOptionBoxOpen(false);
    await deleteComment(_id, accessToken).then((data) => {
      if (data.success) {
        dispatch(removeComment(_id));
      }
    });
  };

  return (
    <div>
      <div className="flex flex-grow w-full">
        <div className="shrink-0">
          <img
            src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
            // src={owner.avatar}
            alt="Profile img"
            className="size-10 rounded-full mt-1"
          />
        </div>
        <div className="pb-1 pl-2 grow">
          <div className="relative ">
            <div className="rounded-2xl text-gray-700 bg-slate-100 p-3">
              <p className="text-gray-600 truncate text-base font-semibold leading-none">
                {owner.fullName}
                <span className="seperator-dot text-slate-600 text-sm font-normal">
                  {formattedDate}
                </span>
              </p>
              <p className="text-xs font-semibold">@{owner.username}</p>
              <div
                ref={textRef}
                className={`leading-tight ${
                  isClamped ? "line-clamp-2" : "line-clamp-none"
                }`}
              >
                {content}
              </div>
            </div>
            <button
              onClick={() => setisClamped((prev) => !prev)}
              className={`${
                moreButtonVisible ? "" : "hidden"
              } pl-12 bg-gradient-to-r from-transparent via-slate-100 to-slate-100 absolute bottom-12 right-2 font-semibold text-slate-700`}
            >
              {isClamped ? "...more" : "...less"}
            </button>
            {/* Like and dislike buttons */}
            <div className="flex py-1 gap-2 ">
              {/* Like Button */}
              <div className="flex items-center gap-5 text-slate-700">
                <div className="flex items-center">
                  <button className="size-8 flex items-center justify-center hover:bg-[#d5d89b] rounded-full">
                    <GoHeart
                      className={`text-lg sm:text-xl  ${
                        liked ? "hidden" : "inline"
                      }`}
                    />
                    <GoHeartFill
                      className={`text-lg sm:text-xl ${
                        liked ? "inline" : "hidden"
                      }`}
                    />
                  </button>
                  <span className="pl-1 text-sm ">{likeCount}</span>
                </div>
                <button className="size-8 flex items-center justify-center hover:bg-[#d5d89b] rounded-full">
                  <IoArrowRedo className="text-xl" />
                </button>
                {/* Options Box and button */}
                <div className="relative group">
                  <div
                    className={`${
                      isOptionBoxOpen
                        ? " scale-y-100 opacity-100 transform transition-all 1 ease origin-bottom"
                        : " scale-y-0 opacity-0 transform transition-all 0 ease "
                    }       absolute bottom-8 left-[-28px] text-nowrap p-1 z-20 bg-white border-2 text-center rounded-xl cursor-pointer`}
                  >
                    <button
                      className={`${
                        isOwner ? "block" : "hidden"
                      } hover:bg-slate-200 py-1 px-4 rounded-lg w-full`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className={`${
                        isOwner ? "block" : "hidden"
                      } hover:bg-slate-200 py-1 px-4 rounded-lg w-full`}
                    >
                      Delete
                    </button>
                    <button
                      className={`${
                        isOwner ? "hidden" : "block"
                      } hover:bg-slate-200 py-1 px-4 rounded-lg w-full`}
                    >
                      Report
                    </button>
                  </div>
                  <button
                    onClick={() => setIsOptionBoxOpen((prev) => !prev)}
                    className={`${
                      isOptionBoxOpen ? "bg-[#d5d89b]" : ""
                    } size-8 flex items-center justify-center group-hover:bg-[#d5d89b] rounded-full`}
                  >
                    <BsThreeDots className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-slate-300 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Comment;
