from flask import Flask
from routes import routes

app = Flask(__name__)

routes.setup(app)

if __name__ == '__main__':
    app.run(debug=True)
