from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer
from datetime import timedelta
from rembg import remove
from PIL import Image
import io
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import authentication modules
from database import init_db, get_db
from models import UserCreate, UserLogin, UserResponse, Token, UserInDB
from auth import (
    authenticate_user, create_user, create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Background Removal API with Authentication")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Enable CORS for the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Serve static files (frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return RedirectResponse(url="/login")

@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user"""
    with get_db() as db:
        # Check if user already exists
        if get_user_by_username(db, user.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        if get_user_by_email(db, user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        db_user = create_user(db, user.username, user.email, user.password)
        return UserResponse(**db_user.dict())

@app.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Authenticate user and return JWT token"""
    with get_db() as db:
        user = authenticate_user(db, user_credentials.username, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(**current_user.dict())

@app.post("/remove-bg")
async def remove_background(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Remove background from image (protected endpoint)"""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image data
        image_bytes = await file.read()
        input_image = Image.open(io.BytesIO(image_bytes))

        # Remove the background using rembg
        output_image = remove(input_image)

        # Convert back to bytes to send to frontend
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()

        return Response(content=img_byte_arr, media_type="image/png")
    
    except Exception as e:
        print(f"Error removing background: {e}")
        raise HTTPException(status_code=500, detail="Failed to process image.")

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker"""
    return {"status": "healthy", "service": "background-removal-api"}

@app.get("/login")
async def login_page():
    """Serve login page"""
    try:
        with open("static/login.html", "r") as f:
            return Response(content=f.read(), media_type="text/html")
    except FileNotFoundError:
        return JSONResponse(
            status_code=404,
            content={"detail": "Login page not found"}
        )

# Helper functions (updated for PostgreSQL)
def get_user_by_username(db, username: str):
    """Get user by username from database"""
    from auth import get_user_by_username as auth_get_user
    return auth_get_user(db, username)

def get_user_by_email(db, email: str):
    """Get user by email from database"""
    from auth import get_user_by_email as auth_get_email
    return auth_get_email(db, email)

if __name__ == "__main__":
    import uvicorn
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8080"))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    # Run the server
    uvicorn.run(app, host=host, port=port, reload=debug)
