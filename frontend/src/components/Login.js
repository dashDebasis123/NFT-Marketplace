import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Alert } from "@material-tailwind/react";
import { Toast } from "react-bootstrap";
import { useUserAuth } from "./context/UserAuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn, googleSignIn } = useUserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError("");
        }, 5000); // 5000 milliseconds (5 seconds)

        return () => clearTimeout(timeoutId); // Cleanup on unmount or dependency change
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password);
            console.log(email + " successfully logged in");
            navigate("/Marketplace");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* {<Alert variant="danger" dismissible>{error}</Alert>} */}

                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Log in to your account
                    </h2>
                </div>

                <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                    {error && (
                        <Toast
                            onClose={() => setError("")}
                            show={true}
                            delay={5000}
                            autohide
                        >
                            <Toast.Header bg="danger" text="white">
                                <strong className="mr-auto">Error</strong>
                            </Toast.Header>
                            <Toast.Body>{error}</Toast.Body>
                        </Toast>
                    )}
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={handleSubmit}
                            >
                                Sign in
                            </button>
                        </div>
                        <div>
                            <button
                                class="flex w-full justify-center  border-slate-800 rounded-lg text-slate-800 dark:text-slate-0 hover:border-slate-500 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-500 hover:shadow transition duration-150"
                                onClick={handleGoogleSignIn}
                            >
                                <img
                                    class="w-7 h-7"
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    loading="lazy"
                                    alt="google logo"
                                />
                                <span>Login with Google</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-12 text-center text-sm text-blue-900 ">
                        Not a member?{" -- "}
                        <Link to="/signup">Signup</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
