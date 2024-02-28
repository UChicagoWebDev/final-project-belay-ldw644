from base import db

def get_reactions_messages(message_id):
    sql = "SELECT reactions_m.*, users.name FROM reactions_m JOIN users ON reactions_m.user_id = users.id WHERE message_id = ? and display = 1"
    data = (message_id,)
    rows = db.query_db(sql, data)
    result = {}

    if rows:
        for row in rows:
            if row["emoji"] in result.keys():
                result[row["emoji"]].append(row["name"])
            else:
                result[row["emoji"]] = [row["name"]]
        return result
    else:
        return None

def get_reactions_replies(reply_id):
    sql = "SELECT reactions_r.*, users.name FROM reactions_r JOIN users ON reactions_r.user_id = users.id WHERE reply_id = ? and display = 1"
    data = (reply_id,)
    rows = db.query_db(sql, data)
    result = {}

    if rows:
        for row in rows:
            if row["emoji"] in result.keys():
                result[row["emoji"]].append(row["name"])
            else:
                result[row["emoji"]] = [row["name"]]
        return result
    else:
        return None

def post_reactions_messages(user, message_id, emoji, display):
    sql = "SELECT * FROM reactions_m WHERE user_id = ? and message_id = ? and emoji = ?"
    data = (user["id"], message_id, emoji)
    row = db.query_db(sql, data, one=True)
    if row:
        sql = "UPDATE reactions_m SET display = ? WHERE user_id = ? and message_id = ? and emoji = ?"
        data = (display, user["id"], message_id, emoji)
    else:
        if display:
            sql = "INSERT INTO reactions_m (user_id, message_id, emoji, display)"
            data = (user["id"], message_id, emoji, True)        

def post_reactions_replies(user, reply_id, emoji, display):
    sql = "SELECT * FROM reactions_r WHERE user_id = ? and reply = ? and emoji = ?"
    data = (user["id"], reply_id, emoji)
    row = db.query_db(sql, data, one=True)
    if row:
        sql = "UPDATE reactions_r SET display = ? WHERE user_id = ? and reply_id = ? and emoji = ?"
        data = (display, user["id"], reply_id, emoji)
    else:
        if display:
            sql = "INSERT INTO reactions_r (user_id, reply_id, emoji, display)"
            data = (user["id"], reply_id, emoji, True)


