import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // You can add API call here for signup
    try {
        const res = await axios.post("http://localhost:3002/user", formData);
        alert("Signup Successful!");
        setFormData({ name: "", username: "", password: "" });
    } catch (err) {
        console.error(err);
        // Use optional chaining to safely access error message
        const message = err.response?.data?.error || "Something went wrong. Please try again.";
        alert(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center  bg-cover bg-no-repeat bg-fixed px-5" style={{
            backgroundImage: `url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')`,
        }}>
      <div className="w-full max-w-2xl bg-white opacity-95  p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-slate-800 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block  font-semibold text-slate-700 text-lg dark:text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 "
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-700  dark:text-gray-600 mb-1">
              Username
            </label>
            <input
              type="email"
              name="username"
              placeholder="abc@example.com"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-700  dark:text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-gray-800  text-md font-semibold">
          Already have an account? <span className="text-slate-500 cursor-pointer hover:underline"><Link to='/login' >Login</Link> </span>
        </p>
      </div>
    </div>
  );
}
