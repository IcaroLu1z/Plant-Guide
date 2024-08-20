from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import os
import json
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']
users_collection = db['users']
profiles_collection = db['profiles']

# Ensure directory for profile photos exists
if not os.path.exists('profile_photos'):
    os.makedirs('profile_photos')

# Route to handle user sign up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists!'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({'username': username, 'password': hashed_password})
    return jsonify({'message': 'User created successfully!'}), 201

# Route to handle user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400

    user = users_collection.find_one({'username': username})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'message': 'Login successful!'}), 200
    else:
        return jsonify({'message': 'Invalid username or password!'}), 400

# Route to handle profile creation
@app.route('/create-profile', methods=['POST'])
def create_profile():
    try:
        # Extract data from request
        name = request.form.get('name')
        email = request.form.get('email')
        plants = request.form.get('plants')
        photo = request.files.get('photo')

        if not name or not email:
            return jsonify({'message': 'Name and email are required!'}), 400

        # Convert plants to a list
        plants_list = json.loads(plants) if plants else []

        # Save photo to a directory and store its path
        photo_filename = None
        if photo:
            photo_filename = f"profile_photos/{ObjectId()}.jpg"
            photo.save(photo_filename)

        # Create profile document
        profile = {
            'name': name,
            'email': email,
            'plants': plants_list,
            'photo': photo_filename
        }

        profiles_collection.insert_one(profile)

        return jsonify({'message': 'Profile created successfully!'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error creating profile'}), 400

if __name__ == '__main__':
    app.run(debug=True)
