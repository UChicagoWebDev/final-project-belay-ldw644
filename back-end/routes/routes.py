from flask import jsonify, request
from services import users
from base import network, db
def setup(app):

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
            return network.return_with_fail("Name Already Exist.")