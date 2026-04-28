import { useState } from "react";
import { api } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Conta criada com sucesso!");

     
      window.location.href = "/login";

    } catch (err) {
      alert("Erro ao registrar");
    }
  }

  return (
    <div style={{
      height: "90vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#111010"
    }}>
      <div style={{
        background: "#2a3d55",
        padding: 30,
        borderRadius: 20,
        color: "#fff",
        width: 300
      }}>
        <h2>📝 Criar conta</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "95%", marginTop: 10, padding: 10 }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "95%", marginTop: 10, padding: 10 }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "95%", marginTop: 10, padding: 10 }}
        />

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 12,
            background: "#fff",
            color: "#000"
          }}
        >
          Criar conta
        </button>

        <p style={{ marginTop: 10 }}>
          Já tem conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}

export default Register;