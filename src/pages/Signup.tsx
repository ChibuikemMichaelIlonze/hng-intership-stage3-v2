import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
     
      setError("");
      setSuccessMessage("Signup successful! You can now log in.");
     
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);
    } catch (error) {
      
      setError(error.message);
     
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Image Gallery</h1>
            <p className="py-6">Sign up to share your images</p>
            {error && <div className="text-red-600">{error}</div>}
            {successMessage && <div className="text-green-600">Successful!</div>}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Signup</button>
              </div>
              <div className="mx-auto mt-2">
                <p>
                  Already signed up?{" "}
                  <Link to="/login" className="text-blue-500">LOG IN</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signup;
