from base import db
import re

def get_messages(user, channel_id, last_id):
    sql = """SELECT messages.*, users.name FROM messages JOIN users ON messages.user_id = users.id WHERE messages.channel_id = ? and messages.id > ?"""
    data = (channel_id, last_id)
    rows = db.query_db(sql, data)
    if rows:
        last_id = rows[-1]["id"]
        sql = "SELECT * FROM last_read WHERE user_id = ? and channel_id = ?"
        data = (user["id"], channel_id)
        row = db.query_db(sql, data, one=True)
        if row and (row["message_id"] != last_id):
            sql = "UPDATE last_read SET message_id = ? WHERE user_id = ? and channel_id = ?"
            data = (last_id, user["id"], channel_id)
            db.query_db(sql, data)
        elif not row:
            sql = "INSERT INTO last_read (user_id, channel_id, message_id) VALUES (?, ?, ?)"
            data = (user["id"], channel_id, last_id)
            db.query_db(sql, data)
        for row in rows:
            pattern = r'(https?://\S+\.(?:jpg|jpeg|png|gif))'
            image_urls = re.findall(pattern, row["body"])
            for url in image_urls:
                print(url)
            row["urls"] = image_urls
            row["body"] = re.sub(pattern, '', row["body"])
    return rows

def post_messages(user, channel_id, body):
    sql = """INSERT INTO messages (user_id, channel_id, body, replies_num) values (?, ?, ?, ?)"""
    data = (user["id"], channel_id, body, 0)
    db.query_db(sql, data)
    return None

def get_one_message(message_id):
    sql = 'SELECT *,users.name FROM messages JOIN users ON messages.user_id = users.id WHERE messages.id = ?'
    data = (message_id,)
    row = db.query_db(sql, data, one=True)
    return row