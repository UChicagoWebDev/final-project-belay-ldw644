from base import db

def get_messages(channel_id, last_id):
    sql = """SELECT * FROM messages WHERE channel_id = ? and id > ?"""
    data = (channel_id, last_id)
    return db.query_db(sql, data)

def post_messages(user, channel_id, body):
    sql = """INSERT INTO messages (user_id, channel_id, body, replies_num) values (?, ?, ?, ?)"""
    data = (user["id"], channel_id, body, 0)
    db.query_db(sql, data)
    return None
