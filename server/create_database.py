import sqlite3

# Creates initial database for API
def create_database():
    db = sqlite3.connect('albums.db')
    cursor = db.cursor()
    
    # Create assets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            year INTEGER,
            type TEXT CHECK(type IN ('manually_added', 'from_library')) NOT NULL,
            hidden TEXT CHECK(hidden IN ('yes', 'no')) DEFAULT 'no',
            tags TEXT)

    ''')
    
    db.commit()
    db.close()

if __name__ == '__main__':
    create_database()
