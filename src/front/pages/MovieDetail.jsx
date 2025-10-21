import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MovieDetails.css";

export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState([]);
  const [watchLink, setWatchLink] = useState(null);

  useEffect(() => {
    // 🔹 Petición 1: Detalles de la película
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    })
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error("Error al obtener detalles:", err));

    // 🔹 Petición 2: Plataformas donde verla
    fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const es = data.results?.ES;
        if (es) {
          setProviders(es.flatrate || []);
          setWatchLink(es.link || null);
        }
      })
      .catch(err => console.error("Error al obtener plataformas:", err));
  }, [id]);

  if (!movie) return <p>Cargando película...</p>;

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>

      <img
        className="movie-poster"
        src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
        alt={movie.title}
      />

      <p className="overview">{movie.overview}</p>

      <h3>Plataformas disponibles:</h3>

      <div className="providers">
        {providers.length > 0 ? (
          providers.map((p) => (
            <a
              key={p.provider_id}
              href={watchLink}               // 🔗 Enlace TMDb (redirige a Netflix, Prime, etc.)
              target="_blank"
              rel="noopener noreferrer"
              className="provider"
              title={`Ver en ${p.provider_name}`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
              />
              <span>{p.provider_name}</span>
            </a>
          ))
        ) : (
          <p>No disponible en plataformas conocidas.</p>
        )}
      </div>
    </div>
  );
};
