# --- AUTH (Flask) ---
import os, datetime, jwt
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, User   # asumiendo modelo User ya aprobado

api = Blueprint("api", __name__)
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "dev-secret")
JWT_ALG = "HS256"

def make_token(user_id):
    payload = {
        "sub": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def current_user():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        uid = payload.get("sub")
        return db.session.get(User, uid)
    except Exception:
        return None

@api.post("/auth/register")
def auth_register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not all([name, email, password]):
        return jsonify({"msg": "Faltan campos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email ya existe"}), 409

    user = User(name=name, email=email, password=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    token = make_token(user.id)
    return jsonify({"token": token, "user": user.serialize()}), 201

@api.post("/auth/login")
def auth_login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not all([email, password]):
        return jsonify({"msg": "Faltan credenciales"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = make_token(user.id)
    return jsonify({"token": token, "user": user.serialize()}), 200

@api.get("/auth/me")
def auth_me():
    user = current_user()
    if not user:
        return jsonify({"msg": "No autorizado"}), 401
    return jsonify(user.serialize()), 200
