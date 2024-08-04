import more from "../../public/Icons/more.png";
import tickMark from "../../public/Icons/tick-mark.png";

const VideoCard = () => {
  return (
    <>
      {/* <div className="flex w-full justify-center h-[100vh] bg-slate-300"> */}
      <div className="flex flex-col max-w-96">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
          className="w-auto mb-2 aspect-video object-cover rounded-xl"
        />
        <div className="flex justify-around gap-3">
          <img
            src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=126&h=75&dpr=1"
            alt="Profile img"
            className="size-10 rounded-full"
          />
          <div className="flex-grow">
            <p className="text-black flex-grow font-sans font-semibold text-wrap line-clamp-2 leading-5">
              Video Title Lorem ipsum dolor sdfjjd sdfkdslkfklsdf sdfjlksdf
              hsdfsdf sdfsdfsdfjhdsk
            </p>
            <div className="flex items-center gap-1">
              <h3 className="text-gray-600 p-0 ">Channel Name </h3>
              <img
                src="./Icons/more.png"
                alt="option icon"
                className="size-3"
              />
            </div>
            <p className="text-gray-600">
              1M Views <span>. 2 Years ago</span>
            </p>
          </div>
          <img src="./Icons/more.png" alt="option icon" className="size-6" />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default VideoCard;
