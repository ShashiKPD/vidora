import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/HomePage.jsx";
import {
  Login,
  Register,
  VideoPage,
  ChannelPage,
  PlaylistPage,
  HistoryPage,
} from "@/pages/";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="channel/:username/upload" element={<ChannelPage />} />
        <Route path="channel/:username" element={<ChannelPage />} />
        <Route path="watch/:videoId" element={<VideoPage />} />
        <Route path="playlist" element={<PlaylistPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="*" element={<span>404 NOT FOUND :(</span>} />
      </Route>
      <Route path="/about" element={<span>About Page</span>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </>
  )
);

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<span>Home Page</span>} />
//       <Route path="/about" element={<span>About Page</span>} />
//       <Route path="/channel/:channelId" element={<span>Channel Page</span>} />
//       <Route path="/watch/:videoId" element={<span>Video Page</span>} />
//       <Route path="*" element={<span>404 NOT FOUND :(</span>} />
//     </Routes>
//   );
// };

export default AppRouter;
