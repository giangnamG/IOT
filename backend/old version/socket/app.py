import os, json
from dotenv import load_dotenv
from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS

load_dotenv()

front_end = os.getenv('FRONTEND_URL')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app, cors_allowed_origins=front_end)

CORS(app, resources={r"/api/v1/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/', methods=['GET','POST'])
def index():
    try:
        if request.method == 'GET':
            socketio.emit('response', 'this is a test')
            return 'hello'
        elif request.method == 'POST':
            data = request.get_json()
            print(data)
            socketio.emit(data['topic'], data)
            return 'ok'
    except Exception as e:
        print(e)
        return 'some error', 503
@app.route('/api/v1/publish_cmd', methods=['POST'])
def publish_cmd():
    data = request.get_json()
    topic = data['topic']
    message = data['message']
    return {'message': 'Command published successfully'}

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    socketio.emit('response', 'hello client reply from '+data)
    
if __name__ == '__main__':
    socketio.run(app, port=os.getenv('SOCKET_PORT'), debug=True)