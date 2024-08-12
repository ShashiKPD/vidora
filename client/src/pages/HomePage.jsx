import { Sidebar, VideosCardView } from "@/components";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }
  }, [authStatus]);

  return (
    <>
      <div className="flex justify-center p-2 sm:p-4">
        <VideosCardView />
      </div>
    </>
  );
};

export default Home;
