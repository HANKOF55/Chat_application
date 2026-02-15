import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import { useSelector } from "react-redux";

const Layout = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <>
            <div className="h-screen flex flex-col">

                <TopBar />

                <div className="max-h-full flex-1 overflow-y-auto pt-16 pb-16">
                    <Outlet />
                </div>

                {isAuthenticated && <BottomBar />}
            </div>

        </>
    );
};

export default Layout;