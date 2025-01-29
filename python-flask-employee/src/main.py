from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import os
from infrastructure.database import DatabaseHandler

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

db_handler = DatabaseHandler()


if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', 5000))
    db_handler.preare_database() #TODO: not sure if creation of database should be in main but oh well.
    socketio.run(app, port=port, host='0.0.0.0', allow_unsafe_werkzeug=True)