from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb+srv://sankhyapatra0808:4cM6mcEwipy1fMiT@cluster0.ub7lu.mongodb.net/')
db = client["user_data"]  
users = db["users"]  

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # 🔒 Hash the password and save user
    hashed_password = generate_password_hash(password)
    users.insert_one({"name": name, "email": email, "password": hashed_password})

    return jsonify({"message": "Registration successful"}), 201,

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"message": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True)
