// src/front/pages/Login.jsx 
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const ok = await login(email, password);
    if (ok) navigate("/profile");
    else setErr("Email o contraseña incorrectos");
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <h1 className="my-4">Iniciar sesión</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={onSubmit} className="card p-3 shadow-sm">
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
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}

export default Login;
