import sqlite3

DB_PATH = "notes.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            summary TEXT,
            tags TEXT,
            folder TEXT DEFAULT 'General',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Add folder column if it doesn't exist (for existing databases)
    try:
        conn.execute("ALTER TABLE notes ADD COLUMN folder TEXT DEFAULT 'General'")
    except:
        pass
    conn.commit()
    conn.close()