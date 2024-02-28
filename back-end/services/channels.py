from base import db

def check_name_availability(name):
    sql = """
    SELECT name FROM channels where name = ?
    """
    data = (name,)
    row = db.query_db(sql, data, one=True)
    if row:
        return False
    else:
        return True

def create_channel(name):
    sql = """
    INSERT INTO channels (name, password, api_key) VALUES (?, ?, ?)
    """
    api_key = uuid.uuid4()
    data = (name, password, api_key)
    db.query_db(sql, data)
    return None

def channel_list():
    sql = """
    SELECT * FROM CHANNELS
    """
    rows = db.query_db(sql)
    return rows
