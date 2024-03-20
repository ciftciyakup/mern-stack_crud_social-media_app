import PostsContainer from "./PostsContainer";
import Sidebar from "./Sidebar/Sidebar";

const Home = () => {
  return (
    <>
      <div className="flex h-full md:w-4/5 lg:w-4/6 mt-14 max-[600px]:mt-[106px] max-[540px]:mt-36 mx-auto">
        <PostsContainer />
        <Sidebar />
      </div>
    </>
  );
};

export default Home;
