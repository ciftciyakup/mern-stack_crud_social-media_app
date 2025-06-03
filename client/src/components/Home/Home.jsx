import { useState } from "react";
import PostsContainer from "./PostsContainer";
import Sidebar from "./Sidebar/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <button
        className="lg:hidden absolute top-2 left-2 z-20 bg-white rounded-full p-2 shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Sohbet listesini aç"
      >
        <MenuIcon />
      </button>
      <div className="flex h-full md:w-4/5 lg:w-4/6 mt-14 max-[600px]:mt-[106px] max-[540px]:mt-36 mx-auto">
        <PostsContainer />
        <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      </div>
    </>
  );
};

export default Home;
