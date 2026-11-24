import {useState} from "react";
import {useNavigate,Link} from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin=async (e) => {
        e.preventDefault();
        
     localStorage.setItem("token", "demo-token");
    const nameFromEmail = email.split("@")[0].replace(/[._-]/g, " ").replace(/\d+/g, "").trim();
    const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    localStorage.setItem("user", JSON.stringify({ name: displayName, email: email }));
    navigate("/dashboard");
    };
    
    return (
        <div className="min-h-screen bg-[#0B0B12] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-[#12121C] border border-[#2A2A3D] p-8 rounded-xl w-[90%] max-w-md">
        <h1 className="text-white text-2xl font-bold">FocusFlow</h1>
        <p className="text-[#9CA3AF] mb-6">Welcome back</p>
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit">Login</Button>
        <p className="text-[#9CA3AF] text-sm mt-4">No account? <Link to="/register" className="text-[#22D3EE]">Register</Link></p>
      </form>
    </div>
  );
}
