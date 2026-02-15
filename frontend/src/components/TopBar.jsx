
import { useNavigate } from "react-router-dom";
import { logout } from "../store/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "../api/axios";


const TopBar = () => {


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);


    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            setIsLoading(true)

            try {
                await api.post("/auth/logout", {});
            } catch (err) {
            }

            dispatch(logout());
            navigate("/register");

        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section >
                <div className="navbar bg-base-100 shadow-md px-10 fixed top-0 w-full z-50">

                    {/* Left side */}
                    <div className="flex-1">
                        <a className="text-xl font-bold normal-case">{user ? user.username : "Chat App"}</a>
                    </div>

                    {/* Right side */}
                    <div className="flex-none">
                        {isAuthenticated &&
                            (
                                <button className={`btn btn-error ${isLoading ? "btn-disabled" : ""}`} onClick={handleLogout}>
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    {isLoading ? "Logging out..." : "Logout"}
                                </button>
                            )
                        }

                    </div>

                </div>

            </section>
        </>
    )
}

export default TopBar;