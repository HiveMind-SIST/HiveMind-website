import os
import uuid
from datetime import datetime
import motor.motor_asyncio
from fastapi import UploadFile
import aiofiles
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.concurrency import run_in_threadpool

# --- Configuration ---
load_dotenv()
MONGO_CONNECTION_STRING = os.environ["MONGO_CONNECTION_STRING"]
DATABASE_NAME = "website"
UPLOAD_DIR = "uploads"

# --- Password Hashing Setup ---
# Using bcrypt, a secure and widely-used hashing algorithm
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database Connection ---
# Using motor for asynchronous access to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_CONNECTION_STRING)
db = client[DATABASE_NAME]

# Getting collections from the database
projects_collection = db.get_collection("projects")
members_collection = db.get_collection("members")
gallery_collection = db.get_collection("gallery")
blogs_collection = db.get_collection("blogs")
users_collection = db.get_collection("users")


# --- Security Helper Functions (Fully Async) ---


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a password in a thread pool to avoid blocking the event loop.
    """
    return await run_in_threadpool(pwd_context.verify, plain_password, hashed_password)


async def get_password_hash(password: str) -> str:
    """
    Hashes a password in a thread pool to avoid blocking the event loop.
    """
    return await run_in_threadpool(pwd_context.hash, password)


# --- General Helper Functions ---
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_upload_file(upload_file: UploadFile) -> str | None:
    """
    Saves an uploaded file to the UPLOAD_DIR with a unique hex name.
    Returns the web-accessible path to the saved file.
    """
    if not upload_file or not upload_file.filename:
        return None
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await upload_file.read()
        await out_file.write(content)

    return f"/{UPLOAD_DIR}/{unique_filename}"


def mongo_id_serializer(doc: dict) -> dict:
    """
    Converts MongoDB's ObjectId to a string 'id' for JSON serialization.
    This is a fast, synchronous, in-memory operation.
    """
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc


# --- GET (Read) Operations ---


async def get_user_by_email(email: str) -> dict | None:
    """Finds a user by their email address."""
    user = await users_collection.find_one({"email": email})
    if user:
        return mongo_id_serializer(user)
    return None


async def get_all_projects() -> list:
    projects = []
    async for project in projects_collection.find():
        projects.append(mongo_id_serializer(project))
    return projects


async def get_all_members() -> list:
    members = []
    async for member in members_collection.find():
        members.append(mongo_id_serializer(member))
    return members


async def get_all_users() -> list:
    """Retrieves all documents from the users collection."""
    users = []
    async for user in users_collection.find():
        users.append(mongo_id_serializer(user))
    return users


async def get_all_gallery_items() -> list:
    gallery_items = []
    async for item in gallery_collection.find():
        gallery_items.append(mongo_id_serializer(item))
    return gallery_items


async def get_all_blogs() -> list:
    blogs = []
    async for blog in blogs_collection.find():
        blogs.append(mongo_id_serializer(blog))
    return blogs


# --- ADD (Create) Operations ---


async def add_project(project_data: dict, image_file: UploadFile) -> dict:
    image_url = await save_upload_file(image_file)
    if image_url:
        project_data["imageUrl"] = image_url

    project_data["createdAt"] = datetime.utcnow()
    await projects_collection.insert_one(project_data)
    return {"status": "success", "message": "Project added successfully"}


async def add_member(
    member_data: dict, photo_file: UploadFile | None, resume_file: UploadFile | None
) -> dict:
    """
    Adds a new member to the 'members' collection.
    If 'isAdmin' is true, also creates a user record with a hashed password.
    """
    is_admin = member_data.pop("isAdmin", False)
    name = member_data.get("name")
    email = member_data.get("email")
    password = member_data.get("password")

    member_doc = {
        "name": name,
        "role": member_data.get("role"),
        "linkedin": member_data.get("linkedin"),
        "github": member_data.get("github"),
        "email": email,
        "createdAt": datetime.utcnow(),
    }

    if photo_file:
        member_doc["photoUrl"] = await save_upload_file(photo_file)
    if resume_file:
        member_doc["resumeUrl"] = await save_upload_file(resume_file)

    await members_collection.insert_one(member_doc)

    if is_admin:
        if not all([name, email, password]):
            return {
                "status": "error",
                "message": "Admin user requires a name, email, and password.",
            }

        existing_user = await get_user_by_email(email)
        if existing_user:
            return {
                "status": "error",
                "message": "A user with this email already exists.",
            }

        hashed_password = await get_password_hash(password)

        user_doc = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "createdAt": datetime.utcnow(),
        }
        await users_collection.insert_one(user_doc)
        return {
            "status": "success",
            "message": "Admin member and user created successfully",
        }

    return {"status": "success", "message": "Member added successfully"}


async def add_gallery_item(gallery_data: dict, image_file: UploadFile) -> dict:
    image_url = await save_upload_file(image_file)
    if image_url:
        gallery_data["imageUrl"] = image_url

    gallery_data["createdAt"] = datetime.utcnow()
    await gallery_collection.insert_one(gallery_data)
    return {"status": "success", "message": "Gallery item added successfully"}


async def add_blog(blog_data: dict, image_file: UploadFile) -> dict:
    image_url = await save_upload_file(image_file)
    if image_url:
        blog_data["imageUrl"] = image_url

    blog_data["createdAt"] = datetime.utcnow()
    await blogs_collection.insert_one(blog_data)
    return {"status": "success", "message": "Blog post added successfully"}
