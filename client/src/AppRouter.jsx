import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import VideoCard from "./components/VideoCard"; // this is temporary
import Home from "./pages/Home.jsx";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="about" element={<span>About Page</span>} />
      <Route path="channel/:channelId" element={<span>Channel Page</span>} />
      <Route path="watch/:videoId" element={<span>Video Page</span>} />
      <Route path="*" element={<span>404 NOT FOUND :(</span>} />
    </Route>
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
