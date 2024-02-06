import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  /*****************HANDLE SUBMIT FUNCTION*****************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setTimeout(() => {
          dispatch(signInFailure(null)); // Clear the error message
        }, 4000); // Hide error message after 4 seconds
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      setTimeout(() => {
        dispatch(signInFailure(null)); // Clear the error message
      }, 4000); // Hide error message after 4 seconds
    }
  };

 
  return (
    <div className="h-full items-center justify-center bg-sage-300 max-w-lg mx-auto">
      <div className="bg-white bg-opacity-90 p-8 rounded-md w-full max-w-md mt-12">
        <h1 className="text-2xl text-center font-semibold mb-7 text-slate-600">
          Sign-in
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="border p-3 rounded-md"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-md"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-500 hover:opacity-95 text-white p-3 rounded-md uppercase disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex justify-between items-center mt-5">
          <div className="text-slate-600 font-semibold">Do not have an account?</div>
          <Link to="/sign-up">
            <span className="text-blue-700 font-semibold">Sign up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;
