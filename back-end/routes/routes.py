from flask import jsonify, request, g
from services import users, channels, messages, replies, reactions
from base import network, db

def setup(app, c):

    @c.before_request()
    def check_api_key_r():
        api_key = request.headers.get('Authorization')
        user = users.check_api_key(api_key)
        if user:
            g.user = user
        else:
            return network.return_with_unauthorized()

    @app.route("/")
    def home_r():
        return "Home Page"
    
    @app.route("/api/signup", methods=["POST"])
    def signup_r():
        name = request.form['name']
        password = request.form['password']
        if users.check_name_availbility('name'):
            api_key = users.signup(name, password)
            return network.return_with_success({"api_key": api_key})
        else:
            return network.return_with_fail("Name already exist.")
    
    @app.route("/api/login", methods=["POST"])
    def login_r():
        name = request.form['name']
        password = request.form['password']
        api_key = users.login(name, password)
        if api_key:
            return network.return_with_success()
        else:
            return network.return_with_fail("No such user or wrong password.")
        
    @c.route("/api/channels/create", methods=["POST"])
    def create_channel_r():
        name = request.form['name']
        if channels.check_name_availability(name):
            channels.create_channel(name)
            return network.return_with_success()
        else:
            return network.return_with_fail("Channel already exist.")
        
    @c.route("/api/channels/list")
    def channel_list_r():
        return network.return_with_success(channels.channel_list())
    
    @c.route("/api/messages/get")
    def get_messages_r():
        channel_id = request.args['channel']
        last_id = request.args['last_id']
        rows = messages.get_messages(channel_id, last_id)
        num = 0
        if rows:
            num = len(rows)
        return network.return_with_success({"messages": rows, "num": num})
    
    @c.route("/api/messages/post", methods = ["POST"])
    def post_messages_r():
        user = getattr(g, 'user', None)
        channel_id = request.form['channel_id']
        body = request.form['body']
        messages.post_messages(user, channel_id, body)
        return network.return_with_success()

    @c.route("/api/replies/get")
    def get_replies_r():
        message_id = request.args['message_id']
        last_id = request.args['last_id']
        rows = replies.get_replies(message_id, last_id)
        num = 0
        if rows:
            num = len(rows)
        return network.return_with_success({"messages": rows, "num": num})
    
    @c.route("/api/replies/post", method = ["POST"])
    def post_replies_r():
        user = getattr(g, 'user', None)
        message_id = request.form['message_id']
        body = request.form['body']
        replies.post_replies(user, message_id, body)
        return network.return_with_success()
    
    @c.route("/api/messages/reactions/get")
    def get_reactions_messages_r():
        message_id = request.args['message_id']
        reaction_text = reactions.get_reactions_messages(message_id)
        if reaction_text:
            return network.return_with_success({"reaction_text": reaction_text, "has_reaction": True})
        else:
            return network.return_with_success({"reaction_text": None, "has_reaction": False})

    @c.route("/api/replies/reactions/get")
    def get_reactions_replies_r():
        reply_id = request.args['reply_id']
        reaction_text = reactions.get_reactions_replies(reply_id)
        if reaction_text:
            return network.return_with_success({"reaction_text": reaction_text, "has_reaction": True})
        else:
            return network.return_with_success({"reaction_text": None, "has_reaction": False})
    
    @c.route("/api/messages/reactions/post")
    def post_reactions_messages_r():
        user = getattr(g, 'user', None)
        message_id = request.form['message_id']
        emoji = request.form['emoji']
        display = request.form['display']
        reactions.post_reactions_messages(user, message_id, emoji, display)
        return network.return_with_success()
    
    @c.route("/api/replies/reactions/post")
    def post_reactions_messages_r():
        user = getattr(g, 'user', None)
        reply_id = request.form['reply_id']
        emoji = request.form['emoji']
        display = request.form['display']
        reactions.post_reactions_messages(user, reply_id, emoji, display)
        return network.return_with_success()
    