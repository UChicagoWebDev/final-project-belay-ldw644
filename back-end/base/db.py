import sqlite3
from flask import g

DATABASE = "db/belay.sqlite3"

def get_db():
    conn = getattr(g, '_database', None)
    if conn is None:
        conn = g._database = sqlite3.connect(DATABASE)
        setattr(g, '_database', conn)
    return conn

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()

    if rows:
        columns = [description[0] for description in cursor.description]
        rows = [dict(zip(columns, row)) for row in rows]
        if one: 
            return rows[0]
        return rows
    return None