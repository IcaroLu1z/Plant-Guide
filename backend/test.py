from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']
profiles_collection = db['profiles']
user_collection = db['users']

# Query all profiles
profiles = profiles_collection.find()

# Clear all documents from a specific collection (e.g., profiles_collection)
'''profiles_collection.delete_many({})
user_collection.delete_many({})'''

# Print each profile
for profile in profiles:
    print(profile)
print('\n--------------------------------------------------------------------------------------\n')

for user in user_collection.find():
    print(user)