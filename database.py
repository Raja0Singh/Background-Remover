import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/defaultdb")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db_connection():
    """Create a database connection using SQLAlchemy"""
    return engine.connect()

@contextmanager
def get_db():
    """Context manager for database operations"""
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    
    try:
        # Create users table using PostgreSQL syntax
        create_table_query = '''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '''
        
        conn.execute(text(create_table_query))
        conn.commit()
        print("PostgreSQL database initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
    finally:
        conn.close()

def create_tables():
    """Create all necessary tables"""
    init_db()

# SQLAlchemy session dependency for FastAPI
def get_db_session():
    """Get SQLAlchemy database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
