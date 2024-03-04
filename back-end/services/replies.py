from base import db

def get_replies(message_id, last_id):
    sql = """SELECT *, users.name FROM replies JOIN users ON replies.user_id = users.id WHERE message_id = ? and replies.id > ?"""
    data = (message_id, last_id)
    return db.query_db(sql, data)

def post_replies(user, message_id, body):
    sql = """INSERT INTO replies (user_id, message_id, body) values (?, ?, ?)"""
    data = (user["id"], message_id, body)
    db.query_db(sql, data)

    sql = """UPDATE messages SET replies_num = replies_num + 1 WHERE id = ?"""
    data = (message_id,)
    db.query_db(sql, data)
    return None
