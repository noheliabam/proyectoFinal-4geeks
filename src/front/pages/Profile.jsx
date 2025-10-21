// src/front/pages/Profile.jsx
import "/src/front/pages/profile.css";
import { useAuth } from "../hooks/useAuth.jsx"; // hook que trae user y loading guarda el usuario si hay token

export default function Profile() {  //lee al usuario actual con el hook
  const { user, loading } = useAuth(); // true mienstras carga la info

  //para que la pagina no se rompa si no hay usuarios..muestra un perfil explicando
  const data = user || {
    name: "Invitado",
    email: "guest@example.com",
    avatar: "",
    country: "—",
    bio: "Inicia sesión para ver y editar tu información real.",
  };

  const avatar =
  (user?.avatar ?? data.avatar ?? user?.avatar_url ?? data.avatar_url ?? "") ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    data.name || "Invitado"
  )}&background=0ea5e9&color=fff`;
  
  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <h1 className="profile-page__title">Mi perfil</h1>
        {loading && <span className="profile-page__badge">Cargando…</span>}
        {!user && !loading && (
          <span className="profile-page__badge">Modo invitado</span>
        )}
      </header>

      <div className="profile-card" role="region" aria-label="Tarjeta de perfil">
        <img className="profile-card__avatar" src={avatar} alt="Avatar" />
        <div className="profile-card__content">
          <h2 className="profile-card__name">{data.name}</h2>
          <p className="profile-card__email">{data.email}</p>
          <div className="profile-card__meta">
            <span>
              País: <strong>{data.country}</strong>
            </span>
          </div>
          {data.bio && <p className="profile-card__bio">{data.bio}</p>}
        </div>
      </div>

      <div className="profile-page__grid">
        <div className="profile-page__card">
          <h3>Preferencias</h3>
          <ul className="profile-page__list">
            <li>
              Idioma: <strong>ES</strong>
            </li>
            <li>
              Tema: <strong>Auto</strong>
            </li>
          </ul>
        </div>
        <div className="profile-page__card">
          <h3>Actividad</h3>
          <ul className="profile-page__list">
            <li>
              Reseñas: <strong>0</strong>
            </li>
            <li>
              Favoritos: <strong>0</strong>
            </li>
            <li>
              Vistas: <strong>0</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
