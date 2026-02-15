import { Home, Users, Globe, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BottomBar() {
    const location = useLocation();



    const navItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "Friends", icon: Users, path: "/friends" },
        { label: "All Users", icon: Globe, path: "/users" },
        { label: "Requests", icon: UserPlus, path: "/requests" },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-base-100 border-t shadow-md z-50">
            <div className="flex justify-around items-center py-2">
                {navItems.map(({ label, icon: Icon, path }) => {
                    const active = location.pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className="flex flex-col items-center text-xs"
                        >
                            <div
                                className={`p-2 rounded-xl transition ${active
                                    ? "bg-primary text-primary-content"
                                    : "text-base-content"
                                    }`}
                            >
                                <Icon size={22} />
                            </div>
                            <span className="mt-1">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>

    );
}
