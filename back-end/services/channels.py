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
    INSERT INTO channels (name) VALUES (?)
    """
    data = (name,)
    db.query_db(sql, data)
    return None

def channel_list():
    sql = """
    SELECT * FROM CHANNELS
    """
    rows = db.query_db(sql)
    return rows

def get_channel_name(id):
    sql = "SELECT * FROM CHANNELS WHERE id = ?"
    data = (id,)
    row = db.query_db(sql,data,one=True)
    return row

def get_channels_unread_messages(user):
    sql = """
SELECT
  c.id AS channel_id,
  c.name AS channel_name,
  COALESCE(SUM(CASE WHEN m.id > COALESCE(lr.message_id, 0) THEN 1 ELSE 0 END), 0) AS unread_messages_count
FROM
  channels c
LEFT JOIN messages m ON c.id = m.channel_id
LEFT JOIN (
  SELECT
    user_id,
    channel_id,
    MAX(message_id) AS message_id
  FROM
    last_read
  WHERE
    user_id = ?
  GROUP BY
    user_id, channel_id
) lr ON c.id = lr.channel_id AND lr.user_id = :user_id
GROUP BY
  c.id
    """
    data = (user["id"],user["id"])
    return db.query_db(sql, data)