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

def login(name, password):
    sql = """
    SELECT api_key FROM users WHERE name = ? and password = ?
    """
    data = (name, password)
    row = db.query_db(sql, data, one=True)
    if row:
        return row['api_key']
    else:
        return None

def check_api_key(api_key):
    sql = """
    SELECT * FROM users WHERE api_key = ?
    """

    data = (api_key,)
    row = db.query_db(sql, data, one=True)
    if row:
        return row
    else:
        return None