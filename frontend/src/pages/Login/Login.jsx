import { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.identifier, formData.password);
    if (result.success) {
      alert("Logged in successfully!");
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Username or Email" 
        onChange={(e) => setFormData({...formData, identifier: e.target.value})} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;