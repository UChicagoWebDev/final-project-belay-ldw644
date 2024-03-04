from base import db

def get_reactions_messages(message_id, emoji):
    sql = "SELECT reactions_m.*, users.name FROM reactions_m JOIN users ON reactions_m.user_id = users.id WHERE message_id = ? and emoji = ? and display = 1"
    data = (message_id, emoji)
    rows = db.query_db(sql, data)
    result = {}

    if rows:
        for row in rows:
            if row["emoji"] in result.keys():
                result[row["emoji"]].append(row["name"])
            else:
                result[row["emoji"]] = [row["name"]]
        # return result
        return ", ".join(result[row["emoji"]])
    else:
        return None

def get_reactions_replies(reply_id, emoji):
    sql = "SELECT reactions_r.*, users.name FROM reactions_r JOIN users ON reactions_r.user_id = users.id WHERE reply_id = ? and emoji = ? and display = 1"
    data = (reply_id, emoji)
    rows = db.query_db(sql, data)
    result = {}

    if rows:
        for row in rows:
            if row["emoji"] in result.keys():
                result[row["emoji"]].append(row["name"])
            else:
                result[row["emoji"]] = [row["name"]]
        # return result
        return ", ".join(result[row["emoji"]])
    else:
        return None

def post_reactions_messages(user, message_id, emoji, display):
    sql = "SELECT * FROM reactions_m WHERE user_id = ? and message_id = ? and emoji = ?"
    data = (user["id"], message_id, emoji)
    row = db.query_db(sql, data, one=True)
    if row:
        sql = "UPDATE reactions_m SET display = ? WHERE user_id = ? and message_id = ? and emoji = ?"
        data = (True, user["id"], message_id, emoji)
        db.query_db(sql, data)
    else:
        if display == "true":
            sql = "INSERT INTO reactions_m (user_id, message_id, emoji, display) VALUES (?, ?, ?, ?)"
            data = (user["id"], message_id, emoji, True)        
            db.query_db(sql, data)

def post_reactions_replies(user, reply_id, emoji, display):
    sql = "SELECT * FROM reactions_r WHERE user_id = ? and reply_id = ? and emoji = ?"
    data = (user["id"], reply_id, emoji)
    row = db.query_db(sql, data, one=True)
    print("here")
    if row:
        sql = "UPDATE reactions_r SET display = ? WHERE user_id = ? and reply_id = ? and emoji = ?"
        data = (True, user["id"], reply_id, emoji)
        db.query_db(sql, data)
    else:
        
        if display == "true":
            sql = "INSERT INTO reactions_r (user_id, reply_id, emoji, display) VALUES (?, ?, ?, ?)"
            data = (user["id"], reply_id, emoji, True)
            db.query_db(sql, data)


