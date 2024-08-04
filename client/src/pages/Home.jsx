import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  return (
    <>
      <div className="flex justify-between">
        <Sidebar />
        <div className="flex mt-10 mx-auto px-6">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-3 gap-y-8">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
