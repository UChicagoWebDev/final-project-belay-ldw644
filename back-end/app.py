from flask import Flask, Blueprint
from flask_cors import CORS
from routes import routes

app = Flask(__name__)

c = Blueprint('check_needed', __name__) # c => api_key_check_needed

routes.setup(app, c)
CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(c)

if __name__ == '__main__':
    app.run(debug=True)
