import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
     
      setError("");
      setSuccessMessage("Login successful!");
     
      navigate("/");
    } catch (error) {
      
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/user-not-found":
          setError("Email not registered. Please sign up.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError(error.message);
          break;
      }
     
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hero min-h-screen bg-base-200">
     
      <div className="hero-content flex-col">
     
        <div className="text-center">
          <h1 className="text-5xl font-bold">Image Gallery</h1>
          <p className="py-6">Log in to access your account</p>
           {error && <div className="text-red-600">Incorrect Email or Password</div>}
      {successMessage && <div className="text-green-600">{successMessage}</div>}
        </div>
        <div className="card sm:w-[30rem] bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Log In</button>
            </div>
            <div className="mx-auto mt-2">
              No account yet?{" "}
              <Link to="/signup" className="text-blue-500">
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
