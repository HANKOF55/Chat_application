import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/features/authSlice"
import api from "../api/axios";

const Login = () => {


    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault()

        setIsSuccess(false);
        setError(null);
        setIsLoading(true);

        try {

            const payload = { email, password };

            const res = await api.post("/auth/login", payload);
            setIsSuccess(res.data?.success);

            if (res.data?.success) {

                const token = res.data?.token;
                const user = res.data?.data;
                dispatch(loginSuccess({ user: user }));
                navigate("/chat")
            }


        } catch (err) {
            setError(err.response?.data?.error.message);
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
            }, 4000);

            return () => clearTimeout(timer);
        }

        if (Error) {
            const timer = setTimeout(() => {
                setError(false);
            }, 4000);

            return () => clearTimeout(timer);
        }

    }, [isSuccess, Error]);



    return (
        <section className="min-h-screen flex flex-col gap-10 items-center justify-center">
            <form onSubmit={handleLogin}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 shadow-md">
                    <legend className="fieldset-legend text-lg font-semibold">
                        Login
                    </legend>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <button className="btn btn-primary mt-4 w-full" type="submit">
                        Log In
                    </button>

                    <p className="label text-sm mt-3 justify-center">
                        Don’t have an account?{" "}
                        <Link className="text-blue-500 ml-1" to="/register">
                            Sign up
                        </Link>
                    </p>
                </fieldset>
            </form>
            {error && (
                <div className="alert alert-error text-sm">
                    <span>{error}</span>
                </div>
            )}

            {isSuccess && (
                <div className="alert alert-success text-sm">
                    <span>Login successful!</span>
                </div>
            )}


        </section>
    )
}

export default Login
