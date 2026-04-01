from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_db
from models import UserInDB, TokenData
from sqlalchemy import text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# JWT Bearer token
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(db, username: str) -> Optional[UserInDB]:
    """Get user by username from database"""
    try:
        result = db.execute(text("SELECT * FROM users WHERE username = :username"), {"username": username})
        user = result.fetchone()
        if user:
            # Convert Row object to dictionary
            user_dict = dict(user._mapping)
            return UserInDB(**user_dict)
        return None
    except Exception as e:
        print(f"Error getting user by username: {e}")
        return None

def get_user_by_email(db, email: str) -> Optional[UserInDB]:
    """Get user by email from database"""
    try:
        result = db.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
        user = result.fetchone()
        if user:
            # Convert Row object to dictionary
            user_dict = dict(user._mapping)
            return UserInDB(**user_dict)
        return None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None

def authenticate_user(db, username: str, password: str) -> Optional[UserInDB]:
    """Authenticate user with username and password"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_user(db, username: str, email: str, password: str) -> UserInDB:
    """Create a new user in the database"""
    try:
        hashed_password = get_password_hash(password)
        
        # Insert new user
        insert_query = text("""
            INSERT INTO users (username, email, hashed_password) 
            VALUES (:username, :email, :hashed_password) 
            RETURNING id, username, email, hashed_password, created_at
        """)
        
        result = db.execute(insert_query, {
            "username": username,
            "email": email,
            "hashed_password": hashed_password
        })
        
        user_data = result.fetchone()
        db.commit()
        
        # Convert to dictionary and return UserInDB
        user_dict = dict(user_data._mapping)
        return UserInDB(**user_dict)
        
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
        raise

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """Get the current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    with get_db() as db:
        user = get_user_by_username(db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """Get the current active user"""
    return current_user
