import eventlet
eventlet.monkey_patch()

import os, json, time
from datetime import datetime
from config import ApplicationConfig
from topics import * 
from flask import Flask, request, jsonify
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from flask_cors import CORS
from flasgger import Swagger
from models import db, DataRealTime

''' ------------------------------Load Variable----------------------------------'''

# Global variable to keep track of the publish status
publish_status = {'status': None, 'message': None}
subscribe_realtime_status = {'status': None, 'topic':None, 'message': None}
subscribe_command_status = {'status': None, 'topic':None, 'message': None}
front_end = os.getenv('FRONTEND_URL')


''' ----------------------------Server Config----------------------------------'''



app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
swagger = Swagger(app)

app.config.from_object(ApplicationConfig)
db.init_app(app)

SOCKET_URL = os.getenv('SOCKET_URL')
PORT = os.getenv('PORT')


mqtt = Mqtt(app)
socketio = SocketIO(app, cors_allowed_origins=front_end)

''' ------------------------------------------API DOCUMENT------------------------------------- '''

@app.route('/users', methods=['GET'])
def get_users():
    """
    Get Users
    ---
    responses:
      200:
        description: A list of users
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
    """
    users = [
        {"id": 1, "name": "John Doe","isAdmin": False},
        {"id": 2, "name": "Jane Doe","isAdmin": True}
    ]
    return jsonify(users)

''' ------------------------------------------SERVER------------------------------------- '''
    
@app.route('/', methods=['GET','POST'])
def index():
    try:
        if request.method == 'GET':
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
    global subscribe_command_status
    try:
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S %m-%d-%Y", t)
        
        data = request.get_json()
        print(data)
        topic = topics_publish[data['topic']]
        cmd = commands[data['cmd']]
        mqtt.publish(topic, cmd)
        time.sleep(2.2)
        mqtt.unsubscribe(topic)
        status = None
        print("subscribe_command_status command: ", subscribe_command_status)
        
        if data['cmd'] == 'turnOn' and subscribe_command_status['status'] == 'Wrong Command':
            status = data['topic'] + ' is already on!'
        elif data['cmd'] == 'turnOff' and subscribe_command_status['status'] == 'Wrong Command':
            status = data['topic'] +' is already off!'
        else:
            status = subscribe_command_status['status']
        res = {
            'topic': topic,
            'cmd': cmd,
            'time': current_time,
            'status':status,
        }
        subscribe_command_status = {'status': None, 'topic':None, 'message': None}
        
        return jsonify(res), 200
    except Exception as e:
        return {'error': 'invalid command'}, 500

@app.route('/api/v1/data_stream_logs', methods=['POST'])
def data_stream_logs():
    try:
        data = request.get_json()
        page = data.get('page', 1)
        per_page = data.get('per_page', 10)
        latest = data.get('latest', True) 
        fromDate = data.get('fromDate', False)
        toDate = data.get('toDate', False)
        
        if latest:
            data_paginated = DataRealTime.query.order_by(DataRealTime.timestamp.desc()).paginate(page=page, per_page=per_page, error_out=False)
        else:
            data_paginated = DataRealTime.query.order_by(DataRealTime.timestamp.asc()).paginate(page=page, per_page=per_page, error_out=False)
            
        res = [data.to_dict() for data in data_paginated]
        return jsonify({
            'page': data_paginated.page,
            'per_page': data_paginated.per_page,
            'total': data_paginated.total,
            'pages': data_paginated.pages,
            'data': res
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
''' ------------------------------------SOCKET-------------------------------'''

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    socketio.emit('response', 'hello client reply from '+data)
    

''' -------------------------------------MQTT------------------------------- '''

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Connected with result code {rc}")
        client.subscribe(topics_subscribe['streaming/all'])
        
        client.subscribe(topics_subscribe['temperature'])
        client.subscribe(topics_subscribe['humidity'])
        client.subscribe(topics_subscribe['lights'])
        
        client.subscribe(topics_subscribe['fan'])
        client.subscribe(topics_subscribe['airConditioner'])
        client.subscribe(topics_subscribe['lightBulb'])
        
    else:
        print(f"Failed to connect, return code {rc}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, msg):
    global subscribe_realtime_status
    global subscribe_command_status
    try:
        message = json.loads(msg.payload.decode())
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S %m-%d-%Y", t)
        
        custom_data = None
        
        topic = msg.topic
        if topic in ['streaming/all','temperature', 'humidity', 'lights']:
            print("Emit real time data: ",topic)
            custom_data = {
            'topic': msg.topic,
            'message': {
                'time': current_time,
                'temp': message['temp'],
                'humidity': message['humidity'],
                'light': message['light'],
            }
        }
            ''' emit real time data '''
            socketio.emit(topic, custom_data)
            
            with app.app_context(): 
                new_data = DataRealTime(temp=custom_data['message']['temp'],
                                        humidity=custom_data['message']['humidity'],
                                        light=custom_data['message']['light'],
                                        timestamp=custom_data['message']['time'])
                db.session.add(new_data)
                db.session.commit()

            
            subscribe_realtime_status['status'] = 'received'
            subscribe_realtime_status['topic'] = topic
            subscribe_realtime_status['message'] = custom_data['message']
        else:
            custom_data = message
            subscribe_command_status['status'] = custom_data['status']
            subscribe_command_status['topic'] = topic
            subscribe_command_status['message'] = None
    
    except Exception as e:
        print("Error processing message: ", e)
        print(f"Invalid topic: {msg.topic}")


@mqtt.on_log()
def handle_logging(client, userdata, level, buf):
    print(level, buf)
    
    
''' ------------------------------------SERVER LAUNCH-----------------------------'''

if __name__ == '__main__':
    # app.run(port=PORT, debug=True)
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=True, debug=True)