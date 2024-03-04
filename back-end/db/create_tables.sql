create table users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE,
    password VARCHAR(40),
    api_key VARCHAR(40)
);

create table channels (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE
);

create table messages (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  channel_id INTEGER,
  body TEXT,
  replies_num INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(channel_id) REFERENCES channels(id)
);

create table replies (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  message_id INTEGER,
  body TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(message_id) REFERENCES messages(id)
);

create table reactions_m (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  message_id INTEGER,
  emoji TEXT,
  display BOOLEAN
);

create table reactions_r (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  reply_id INTEGER,
  emoji TEXT,
  display BOOLEAN
);

create table last_read (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  channel_id INTEGER,
  message_id INTEGER
);