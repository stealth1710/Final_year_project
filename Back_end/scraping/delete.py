from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "Products"  # Replace with your database name

# MongoDB Connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["scraped_prices"]  # Replace with your collection name

# Delete all documents in the collection
result = collection.delete_many({})
print(f"Deleted {result.deleted_count} documents.")
