import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Could not create the account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen flex items-center justify-center">
      <div className="bg-[#1A1A2E] border border-[#2A2A3D] p-8 rounded-xl w-[90%] max-w-md">
        <h1 className="text-white text-2xl font-bold text-center">FocusFlow</h1>
        <p className="text-[#9CA3AF] text-center mb-6">Create your account</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && <p role="alert" className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)"
            className="p-3 rounded bg-[#0B0B12] text-white border border-[#2A2A3D]" />
          <button disabled={submitting} className="bg-[#22D3EE] text-black font-bold p-3 rounded disabled:opacity-60">
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-white text-center mt-4">
          Already have an account? <Link to="/login" className="text-[#22D3EE]">Login</Link>
        </p>
      </div>
    </div>
  );
}
