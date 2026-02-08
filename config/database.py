import os
import logging
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import sessionmaker, Session

from models.address import AddressModel  # noqa
from models.base_model import base
from models.bill import BillModel  # noqa
from models.category import CategoryModel  # noqa
from models.client import ClientModel  # noqa
from models.order import OrderModel  # noqa
from models.order_detail import OrderDetailModel  # noqa
from models.product import ProductModel  # noqa
from models.review import ReviewModel  # noqa

# Get logger (logging is configured in main.py)
logger = logging.getLogger(__name__)

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(env_path)

def _sanitize_env_value(value: str | None) -> str | None:
    if value is None:
        return None

    sanitized = value.strip().strip("'\"")
    if sanitized == '':
        return None

    return sanitized


def _env(name: str, default: str) -> str:
    sanitized = _sanitize_env_value(os.getenv(name))
    return default if sanitized is None else sanitized


def _env_int(name: str, default: int) -> int:
    raw = _sanitize_env_value(os.getenv(name))
    if raw is None:
        return default

    try:
        return int(raw)
    except ValueError:
        logger.warning("Invalid %s=%r. Falling back to default %s.", name, raw, default)
        return default


# Database configuration with defaults
DATABASE_URL = _env('DATABASE_URL', '')
POSTGRES_HOST = _env('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = _env_int('POSTGRES_PORT', 5432)
POSTGRES_DB = _env('POSTGRES_DB', 'postgres')
POSTGRES_USER = _env('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = _env('POSTGRES_PASSWORD', 'postgres')

# High-performance connection pool configuration
# For 400 concurrent requests with 4 workers: 400/4 = 100 connections per worker
# Pool size + max_overflow should handle peak load
POOL_SIZE = _env_int('DB_POOL_SIZE', 50)  # Base pool size per worker
MAX_OVERFLOW = _env_int('DB_MAX_OVERFLOW', 100)  # Additional connections during peak
POOL_TIMEOUT = _env_int('DB_POOL_TIMEOUT', 10)  # Wait time for connection (reduced for production)
POOL_RECYCLE = _env_int('DB_POOL_RECYCLE', 3600)  # Recycle connections after 1 hour

fallback_database_url = URL.create(
    drivername='postgresql',
    username=POSTGRES_USER,
    password=POSTGRES_PASSWORD,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
    database=POSTGRES_DB,
)

if DATABASE_URL:
    try:
        database_url = make_url(DATABASE_URL)
    except Exception:
        logger.warning(
            "Invalid DATABASE_URL value. Falling back to POSTGRES_* variables.",
            exc_info=True,
        )
        database_url = fallback_database_url
else:
    database_url = fallback_database_url

DATABASE_URI = database_url.render_as_string(hide_password=False)

# Create engine with optimized connection pooling for high concurrency
engine = create_engine(
    database_url,
    pool_pre_ping=True,  # Verify connections before using (prevents stale connections)
    pool_size=POOL_SIZE,  # Minimum number of connections in pool
    max_overflow=MAX_OVERFLOW,  # Additional connections beyond pool_size
    pool_timeout=POOL_TIMEOUT,  # Seconds to wait before giving up on connection
    pool_recycle=POOL_RECYCLE,  # Recycle connections to prevent stale connections
    echo=False,  # Disable SQL logging in production for performance
    future=True,  # Use SQLAlchemy 2.0 style
)

# SessionLocal class for creating new sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency injection for database sessions.
    Creates a new session for each request and closes it when done.

    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database."""
    try:
        base.metadata.create_all(engine)
        logger.info("Tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise


def drop_database():
    """Drop all tables in the database."""
    try:
        base.metadata.drop_all(engine)
        logger.info("Tables dropped successfully.")
    except Exception as e:
        logger.error(f"Error dropping tables: {e}")
        raise


def check_connection() -> bool:
    """Check if database connection is working."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection established.")
        return True
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        return False
