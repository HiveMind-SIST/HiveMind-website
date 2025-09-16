import os
import uvicorn
from datetime import datetime
from urllib.parse import quote  # Import quote for URL safety
from fastapi import (
    FastAPI,
    Request,
    Form,
    UploadFile,
    File,
    Depends,
    HTTPException,
    status,
    Query,
)
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette_session import SessionMiddleware
from dotenv import load_dotenv

import database

# --- Initial Setup ---

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
app = FastAPI()
app.add_middleware(
    SessionMiddleware, secret_key=SECRET_KEY, cookie_name="session_cookie"
)

# --- Static Files & Templates ---

app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/scripts", StaticFiles(directory="scripts"), name="scripts")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
templates = Jinja2Templates(directory="pages")

# --- Authentication & Protection Dependencies ---


async def get_current_user(request: Request):
    user_email = request.session.get("user_email")
    if user_email:
        user = await database.get_user_by_email(user_email)
        return user
    return None


async def require_login(request: Request):
    user = await get_current_user(request)
    if not user:
        # FIX: Remember the page the user wanted to visit.
        next_url = quote(str(request.url), safe="")
        redirect_url = f"/login?next={next_url}"
        raise HTTPException(
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
            headers={"Location": redirect_url},
        )
    return user


# --- User Login & Logout Endpoints ---


@app.post("/login", response_class=RedirectResponse)
async def handle_login(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    next_url: str = Form("/"),  # FIX: Get the next_url from the form
):
    user = await database.get_user_by_email(email)
    if not user:
        return RedirectResponse(
            url="/login?error=1", status_code=status.HTTP_303_SEE_OTHER
        )

    is_password_correct = await database.verify_password(password, user["password"])

    if is_password_correct:
        request.session["user_email"] = user["email"]
        request.session["user_name"] = user["name"]

        # FIX: Redirect to the intended page, or a default.
        # Check if next_url is a valid path to prevent open redirect vulnerabilities
        if next_url and next_url.startswith("/"):
            return RedirectResponse(url=next_url, status_code=status.HTTP_303_SEE_OTHER)
        # Default redirect if next_url is not provided or invalid
        return RedirectResponse(
            url="/add-project", status_code=status.HTTP_303_SEE_OTHER
        )

    # Add the next_url back to the query params on failed login attempt
    error_redirect_url = f"/login?error=1"
    if next_url and next_url.startswith("/"):
        error_redirect_url += f"&next={quote(next_url)}"
    return RedirectResponse(
        url=error_redirect_url, status_code=status.HTTP_303_SEE_OTHER
    )


@app.get("/logout", response_class=RedirectResponse)
async def handle_logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)


# =================================================================
# --- PUBLIC API Endpoints (GET) ---
# =================================================================


@app.get("/api/projects", response_class=JSONResponse)
async def get_projects():
    return await database.get_all_projects()


@app.get("/api/members", response_class=JSONResponse)
async def get_members():
    return await database.get_all_members()


@app.get("/api/gallery", response_class=JSONResponse)
async def get_gallery():
    return await database.get_all_gallery_items()


@app.get("/api/blogs", response_class=JSONResponse)
async def get_blogs():
    return await database.get_all_blogs()


# =================================================================
# --- PROTECTED API Endpoints (POST) ---
# =================================================================


@app.post("/api/projects", response_class=JSONResponse)
async def create_project(
    projectTitle: str = Form(...),
    projectDescription: str = Form(...),
    techStack: str = Form(...),
    linkedinLink: str = Form(...),
    githubLink: str = Form(...),
    projectImage: UploadFile = File(...),
    current_user: dict = Depends(require_login),
):
    project_data = {
        "title": projectTitle,
        "description": projectDescription,
        "techStack": [tech.strip() for tech in techStack.split(",")],
        "github": githubLink,
        "linkedin": linkedinLink,
    }
    return await database.add_project(project_data, projectImage)


@app.post("/api/members", response_class=JSONResponse)
async def create_member(
    fullName: str = Form(...),
    role: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    linkedin: str = Form(""),
    github: str = Form(""),
    profileImage: UploadFile = File(None),
    resume: UploadFile = File(None),
    adminPrivileges: bool = Form(False),
    current_user: dict = Depends(require_login),
):
    member_data = {
        "name": fullName,
        "role": role,
        "linkedin": linkedin,
        "github": github,
        "email": email,
        "password": password,
        "isAdmin": adminPrivileges,
    }
    return await database.add_member(member_data, profileImage, resume)


@app.post("/api/gallery", response_class=JSONResponse)
async def create_gallery_item(
    caption: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    current_user: dict = Depends(require_login),
):
    gallery_data = {
        "caption": caption,
        "category": category,
        "description": description,
    }
    return await database.add_gallery_item(gallery_data, image)


@app.post("/api/blogs", response_class=JSONResponse)
async def create_blog(
    title: str = Form(...),
    content: str = Form(...),
    date: str = Form(...),
    category: str = Form(...),
    author: str = Form(...),
    readTime: str = Form(...),
    tags: str = Form(...),
    image: UploadFile = File(...),
    current_user: dict = Depends(require_login),
):
    blog_data = {
        "title": title,
        "content": content,
        "date": date,
        "category": category,
        "author": author,
        "readTime": f"{readTime} min read",
        "tags": [tag.strip() for tag in tags.split(",")],
    }
    return await database.add_blog(blog_data, image)


# =================================================================
# --- PUBLIC HTML Page-Serving Endpoints ---
# =================================================================


@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    user = await get_current_user(request)

    projects = await database.get_all_projects()
    members = await database.get_all_members()

    start_date = datetime(2025, 1, 21)
    days_count = (datetime.now() - start_date).days

    context = {
        "request": request,
        "user": user,
        "project_count": len(projects),
        "member_count": len(members),
        "days_count": max(0, days_count),
    }
    return templates.TemplateResponse("index.html", context)


@app.get("/login", response_class=HTMLResponse)
async def serve_login(request: Request, next: str | None = Query(None)):
    user = await get_current_user(request)
    if user:
        return RedirectResponse(
            url="/add-project", status_code=status.HTTP_303_SEE_OTHER
        )

    # FIX: Pass the 'next' URL to the template
    return templates.TemplateResponse(
        "login.html", {"request": request, "user": user, "next_url": next}
    )


@app.get("/projects", response_class=HTMLResponse)
async def serve_projects_page(request: Request):
    user = await get_current_user(request)
    return templates.TemplateResponse(
        "projects.html", {"request": request, "user": user}
    )


@app.get("/members", response_class=HTMLResponse)
async def serve_members_page(request: Request):
    user = await get_current_user(request)
    return templates.TemplateResponse(
        "members.html", {"request": request, "user": user}
    )


@app.get("/gallery", response_class=HTMLResponse)
async def serve_gallery_page(request: Request):
    user = await get_current_user(request)
    return templates.TemplateResponse(
        "gallery.html", {"request": request, "user": user}
    )


@app.get("/blogs", response_class=HTMLResponse)
async def serve_blogs_page(request: Request):
    user = await get_current_user(request)
    return templates.TemplateResponse("blogs.html", {"request": request, "user": user})


# =================================================================
# --- PROTECTED HTML Page-Serving Endpoints ---
# =================================================================


@app.get("/add-project", response_class=HTMLResponse)
async def serve_add_project_page(request: Request, user: dict = Depends(require_login)):
    return templates.TemplateResponse(
        "addproject.html", {"request": request, "user": user}
    )


@app.get("/add-member", response_class=HTMLResponse)
async def serve_add_member_page(request: Request, user: dict = Depends(require_login)):
    return templates.TemplateResponse(
        "addmember.html", {"request": request, "user": user}
    )


@app.get("/add-image", response_class=HTMLResponse)
async def serve_add_image_page(request: Request, user: dict = Depends(require_login)):
    return templates.TemplateResponse(
        "addimage.html", {"request": request, "user": user}
    )


@app.get("/add-blog", response_class=HTMLResponse)
async def serve_add_blog_page(request: Request, user: dict = Depends(require_login)):
    return templates.TemplateResponse(
        "addblog.html", {"request": request, "user": user}
    )
