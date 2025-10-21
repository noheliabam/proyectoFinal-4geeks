// src/front/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const ok = await register({ name, email, password });
    if (ok) navigate("/profile");
    else setErr("No se pudo registrar (¿email en uso?)");
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <h1 className="my-4">Crear cuenta</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={onSubmit} className="card p-3 shadow-sm">
        <div className="mb-3">
        
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control"
                 type="email"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input className="form-control"
                 type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 required />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Register;
