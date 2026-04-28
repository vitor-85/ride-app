import { useState, useEffect } from "react";
import { api } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  async function handleLogin() {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      const { user, token } = res.data;

      
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      
      api.defaults.headers.common['Authorization'] = token;

      
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error(err);
      alert("Login inválido");
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#111"
    }}>
      <div style={{
        background: "#000",
        padding: 30,
        borderRadius: 20,
        color: "#fff",
        width: 300
      }}>
        <h2>🔐 Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginTop: 10, padding: 10 }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginTop: 10, padding: 10 }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 12,
            background: "#fff",
            color: "#000",
            border: "none",
            cursor: "pointer"
          }}
        >
          Entrar
        </button>
        
        <p style={{ marginTop: 10 }}>
  Não tem conta? <a href="/register">Criar conta</a>
</p>
        
              </div>
    </div>
  );
}

export default Login;