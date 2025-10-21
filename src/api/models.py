from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Text, ForeignKey, Float, Date, DateTime, Enum, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    valoration: Mapped[int] = mapped_column(Integer, default=0)

    profile: Mapped["Profile"] = relationship(
        back_populates="user", uselist=False)
    favorites: Mapped[list["Favorites"]] = relationship(
        back_populates="user", uselist=True)
    movie_view: Mapped[list["MoviesViews"]] = relationship(
        back_populates="user", uselist=True)
    reviews: Mapped[list["Reviews"]] = relationship(
        back_populates="user", uselist=True)
    reviews_movie_verse: Mapped[list["ReviewsMovieVerse"]] = relationship(
        back_populates="user", uselist=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "valoration": self.valoration,
            # 👇 evitar recursión infinita
            "profile": self.profile.serialize() if self.profile else None,
            # 👇 mejor listas vacías que None para el front
            "favorites": [f.serialize() for f in self.favorites] if self.favorites else [],
            "movie_view": [m.serialize() for m in self.movie_view] if self.movie_view else [],
            "reviews": [r.serialize() for r in self.reviews] if self.reviews else [],
            "reviews_movie_verse": [rm.serialize() for rm in self.reviews_movie_verse] if self.reviews_movie_verse else []
        }


class Profile(db.Model):
    __tablename__ = "profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120))
    avatar: Mapped[str] = mapped_column(String(500))
    preference: Mapped[str] = mapped_column(String(500))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(
        back_populates="profile", uselist=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "avatar": self.avatar,
            "preference": self.preference,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user": {
                "id": self.user.id,
                "email": self.user.email
            } if self.user else None
        }


class Movies(db.Model):
    __tablename__ = "movies"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(500))
    year: Mapped[int] = mapped_column(Integer)
    actors: Mapped[str] = mapped_column(String(250))
    genere: Mapped[str] = mapped_column(String(250))
    duration: Mapped[int] = mapped_column(Integer)
    # 👇 usa Float (SQLAlchemy), no float (Python)
    valoration: Mapped[float] = mapped_column(Float, default=0)
    total_valoration: Mapped[int] = mapped_column(Integer, default=0)
    url_streaming: Mapped[str] = mapped_column(String(500))

    favorites_by: Mapped[list["Favorites"]] = relationship(
        back_populates="movies", uselist=True)
    movie_view_by: Mapped[list["MoviesViews"]] = relationship(
        back_populates="movies", uselist=True)
    reviews: Mapped[list["Reviews"]] = relationship(
        back_populates="movies", uselist=True)

    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "title": self.title,
            "description": self.description,
            "year": self.year,
            "actors": self.actors,
            "genere": self.genere,
            "duration": self.duration,
            "url_streaming": self.url_streaming,
            "valoration": self.valoration,
            "total_valoration": self.total_valoration,
            "favorites_by": [f.serialize() for f in self.favorites_by] if self.favorites_by else [],
            "movie_view_by": [m.serialize() for m in self.movie_view_by] if self.movie_view_by else [],
            "reviews": [r.serialize() for r in self.reviews] if self.reviews else [],
        }


class Favorites(db.Model):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="favorites")
    movies_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    movies: Mapped["Movies"] = relationship(back_populates="favorites_by")

    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user": {
                "id": self.user.id,
                "email": self.user.email
            } if self.user else None,
            "movies": {
                "id": self.movies.id,
                "title": self.movies.title,
                "year": self.movies.year
            } if self.movies else None
        }


class MoviesViews(db.Model):
    __tablename__ = "movies_views"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="movie_view")
    movies_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    movies: Mapped["Movies"] = relationship(back_populates="movie_view_by")

    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user": {
                "id": self.user.id,
                "email": self.user.email
            } if self.user else None,
            "movies": {
                "id": self.movies.id,
                "title": self.movies.title
            } if self.movies else None
        }


class Reviews(db.Model):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    title: Mapped[str] = mapped_column(String(20), nullable=False)
    body: Mapped[str] = mapped_column(Text())
    valoration: Mapped[int] = mapped_column(Integer, default=0)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    movies_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    user: Mapped["User"] = relationship(back_populates="reviews")
    movies: Mapped["Movies"] = relationship(back_populates="reviews")

    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "title": self.title,
            "body": self.body,
            "valoration": self.valoration,
            "user": {
                "id": self.user.id,
                "email": self.user.email
            } if self.user else None,
            "movies": {
                "id": self.movies.id,
                "title": self.movies.title
            } if self.movies else None
        }


class ReviewsMovieVerse(db.Model):
    __tablename__ = "reviews_movie_verse"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    title: Mapped[str] = mapped_column(String(20), nullable=False)
    body: Mapped[str] = mapped_column(Text(), nullable=False)
    valoration: Mapped[int] = mapped_column(Integer, default=0)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="reviews_movie_verse")

    def serialize(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "title": self.title,
            "body": self.body,
            "valoration": self.valoration,
            "user": {
                "id": self.user.id,
                "email": self.user.email
            } if self.user else None
        }
