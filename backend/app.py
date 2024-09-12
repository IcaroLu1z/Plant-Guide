from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt as pyjwt  # Use pyjwt for JWT operations
from werkzeug.utils import secure_filename
import os
import json
from bson import ObjectId
import datetime
import secrets

# Generate a random 32-byte key
key = secrets.token_hex(32)

app = Flask(__name__)
CORS(app)

# Secret key for JWT encoding/decoding
app.config['SECRET_KEY'] = key

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']
users_collection = db['users']
profiles_collection = db['profiles']

UPLOAD_FOLDER = 'uploads/'
PROFILE_PHOTOS_FOLDER = 'profile_photos/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROFILE_PHOTOS_FOLDER'] = PROFILE_PHOTOS_FOLDER

# Ensure directory for profile photos exists
if not os.path.exists(PROFILE_PHOTOS_FOLDER):
    os.makedirs(PROFILE_PHOTOS_FOLDER)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to handle user sign up
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required!'}), 400

        if users_collection.find_one({'username': username}):
            return jsonify({'message': 'Username already exists!'}), 400
        

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users_collection.insert_one({'username': username, 'password': hashed_password})
        user = users_collection.find_one({'username': username})

        token = pyjwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'message': 'User created successfully!', 'token': token}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error creating user'}), 500

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
        token = pyjwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'message': 'Login successful!', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid username or password!'}), 400


@app.route('/user-profile/<user_id>', methods=['GET'])
def user_profile(user_id):
    try:
        # Find the profile by the 'user_id'
        profile = profiles_collection.find_one({'user_id': user_id})
        
        if not profile:
            return jsonify({'message': 'Profile not found!'}), 404

        # Convert ObjectId to string for JSON serialization
        profile['_id'] = str(profile['_id'])
        
        print(profile)  # For debugging purposes
        
        return jsonify(profile), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error retrieving profile'}), 500


# Route to handle adding a favorite plant
@app.route('/add-favorite', methods=['POST'])
def add_favorite():
    token = request.headers.get('Authorization')
    if token:
        token = token.replace('Bearer ', '')
    data = request.json
    plant = data.get('plant')
    
    if not token or not plant:
        return jsonify({'message': 'Token and plant data are required!'}), 400

    try:
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    profile = profiles_collection.find_one({'user_id': user_id})
    if not profile:
        return jsonify({'message': 'Profile not found!'}), 404

    result = profiles_collection.update_one(
        {'user_id': user_id},
        {'$addToSet': {'favorite_plants': plant}},
        upsert=True
    )

    if result.matched_count == 0 and result.upserted_id:
        return jsonify({'message': 'Profile created and plant added successfully!'}), 201
    elif result.modified_count > 0:
        return jsonify({'message': 'Favorite plant added successfully!'}), 200
    else:
        return jsonify({'message': 'No changes made to the profile.'}), 304

# Route to handle retrieving favorite plants
@app.route('/get-favorites', methods=['GET'])
def get_favorites():
    token = request.headers.get('Authorization').replace('Bearer ', '')
    
    if not token:
        return jsonify({'message': 'Token is required!'}), 400

    try:
        # Decode the token to get the user_id
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    # Fetch the profile using the `user_id`, not `_id`
    profile = profiles_collection.find_one({'user_id': user_id})
    
    if not profile:
        return jsonify({'favorites': []}), 200

    # Return the list of favorite plants
    return jsonify({'favorites': profile.get('favorite_plants', [])}), 200

@app.route('/remove-favorite', methods=['POST'])
def remove_favorite():
    token = request.headers.get('Authorization').replace('Bearer ', '')
    data = request.json
    plant_id = data.get('plantId')

    if not token or not plant_id:
        return jsonify({'message': 'Token and plant ID are required!'}), 400

    try:
        # Decode JWT token to get user_id
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    # Find the user's profile
    profile = profiles_collection.find_one({'user_id': user_id})
    if not profile:
        return jsonify({'message': 'Profile not found!'}), 404

    # Remove the plant from the 'plants' array
    profiles_collection.update_one(
        {'user_id': user_id},
        {'$pull': {'favorite_plants': {'id': plant_id}}}
    )

    return jsonify({'message': 'Favorite plant removed successfully!'}), 200


# Route to handle profile creation
@app.route('/create-profile', methods=['POST'])
def create_profile():
    try:
        # Extract data from request
        user_id = request.form.get('user_id')
        name = request.form.get('name')
        email = request.form.get('email')
        plants = request.form.get('plants')
        photo = request.files.get('photo')

        if not user_id or not name or not email:
            return jsonify({'message': 'User ID, name, and email are required!'}), 400

        # Convert plants to a list
        plants_list = json.loads(plants) if plants else []

        # Save photo to a directory and store its path
        photo_filename = None
        if photo:
            photo_filename = f"profile_photos/{user_id}.jpg"
            photo.save(photo_filename)

        # Create profile document
        profile = {
            'user_id': user_id,
            'name': name,
            'email': email,
            'my_plants': plants_list,
            'favorite_plants': [],
            'photo': photo_filename
        }

        profiles_collection.insert_one(profile)

        return jsonify({'message': 'Profile created successfully!'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error creating profile'}), 400
    
@app.route('/add-plant', methods=['POST'])
def add_my_plant():
    # Extract form data
    name = request.form.get('name')
    acquisition_date = request.form.get('acquisitionDate')
    care_details = request.form.get('careDetails')
    observations = request.form.get('observations')
    plant_photo = request.files.get('photo')

    # Check for authorization token
    token = request.headers.get('Authorization')
    if token:
        token = token.replace('Bearer ', '')
    
    if not token or not name:
        return jsonify({'message': 'Token and plant name are required!'}), 400

    # Validate and decode token
    try:
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    # Fetch user profile
    profile = profiles_collection.find_one({'user_id': user_id})
    if not profile:
        return jsonify({'message': 'Profile not found!'}), 404

    # Save plant photo if it exists
    photo_filename = None
    if plant_photo:
        photo_filename = secure_filename(plant_photo.filename)
        plant_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))

    # Construct plant data
    plant_data = {
        'name': name,
        'acquisition_date': acquisition_date,
        'care_details': care_details,
        'observations': observations,
        'photo': photo_filename
    }

    # Update profile with the new plant
    result = profiles_collection.update_one(
        {'user_id': user_id},
        {'$addToSet': {'my_plants': plant_data}},
        upsert=True
    )

    # Response based on operation result
    if result.matched_count == 0 and result.upserted_id:
        return jsonify({'message': 'Profile created and plant added successfully!'}), 201
    elif result.modified_count > 0:
        return jsonify({'message': 'Plant added to your profile successfully!'}), 200
    else:
        return jsonify({'message': 'No changes made to the profile.'}), 304

@app.route('/get-plants', methods=['GET'])
def get_plants():
    # Check for authorization token
    token = request.headers.get('Authorization')
    if token:
        token = token.replace('Bearer ', '')
    
    if not token:
        return jsonify({'message': 'Token is required!'}), 400

    # Validate and decode token
    try:
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    # Fetch user profile
    profile = profiles_collection.find_one({'user_id': user_id})
    if not profile:
        return jsonify({'message': 'Profile not found!'}), 404

    # Return list of plants
    return jsonify({'my_plants': profile.get('my_plants', [])}), 200

@app.route('/remove-plant', methods=['DELETE'])
def remove_plant():
    # Check for authorization token
    token = request.headers.get('Authorization')
    if token:
        token = token.replace('Bearer ', '')
    
    if not token:
        return jsonify({'message': 'Token is required!'}), 400

    # Validate and decode token
    try:
        payload = pyjwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    # Get plant name from request
    data = request.json
    plant_name = data.get('plant_name')
    if not plant_name:
        return jsonify({'message': 'Plant name is required!'}), 400

    # Fetch user profile
    profile = profiles_collection.find_one({'user_id': user_id})
    if not profile:
        return jsonify({'message': 'Profile not found!'}), 404

    # Remove plant from profile
    result = profiles_collection.update_one(
        {'user_id': user_id},
        {'$pull': {'my_plants': {'name': plant_name}}}
    )

    # Response based on operation result
    if result.modified_count > 0:
        return jsonify({'message': 'Plant removed successfully!'}), 200
    else:
        return jsonify({'message': 'No changes made to the profile.'}), 304

if __name__ == '__main__':
    app.run(debug=True)
