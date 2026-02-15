import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios";

const Register = () => {


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {

            const payload = { username, email, password };

            const res = await api.post("/auth/register", payload);

            setIsSuccess(res.data?.success);

            setUsername("");
            setEmail("");
            setPassword("");

        } catch (err) {
            setError(err.response?.data?.error.message);
        } finally {
            setIsLoading(false);
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

    }, [isSuccess, error]);



    return (
        <section className="min-h-screen flex flex-col items-center gap-10 justify-center">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 shadow-md">
                    <legend className="fieldset-legend text-lg font-semibold">
                        Register User
                    </legend>

                    <label className="label">Username</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter your username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

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
                        Create Account
                    </button>

                    <p className="label text-sm mt-3 justify-center">
                        Already have an account?{" "}
                        <Link className="text-blue-500 ml-1" to="/login">
                            Log in
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
                    <span>Registration successful!</span>
                </div>
            )}

        </section>
    )
}

export default Register
