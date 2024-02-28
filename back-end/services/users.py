from base import db, network
import uuid
def signup(name, password):
    sql = """
    INSERT INTO users (name, password, api_key) VALUES (?, ?, ?)
    """
    api_key = uuid.uuid4()
    data = (name, password, api_key)
    db.query_db(sql, data)
    return api_key

def check_name_availbility(name):
    sql = """
    SELECT name FROM users WHERE name = ?
    """
    data = (name,)
    row = db.query_db(sql, data, one=True)
    return False if row else True
