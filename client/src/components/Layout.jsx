import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="w-[90%] h-screen flex flex-col mx-auto">
      <Navbar />
      <div className="flex grow flex-col items-center justify-center my-6">
        <Outlet />
      </div>
      <footer className="text-xs text-slate-300 mb-2 text-center">
        &copy; Nguyễn Việt Tiên 2026
      </footer>
    </div>
  );
};

export default Layout;
