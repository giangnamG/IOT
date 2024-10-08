import eventlet
eventlet.monkey_patch()

import os, subprocess,json, time
from datetime import datetime
from config import ApplicationConfig
from topics import * 
from flask import Flask, request, jsonify
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from flask_cors import CORS
from flasgger import Swagger
from models import db, DataRealTime, DeviceHistory,DeviceStatus
from sqlalchemy import func

''' ------------------------------Load Variable----------------------------------'''

# Global variable to keep track of the publish status
publish_status = {'status': None, 'message': None}
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

''' Example usage'''
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
              isAdmin:
                type: boolean
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

@app.route('/api/v1/sensors/streaming/logs', methods=['POST'])
def data_stream_logs():
    try:
        data = request.get_json()
        page = data.get('page', 1)
        per_page = data.get('per_page', 10)
        latest = data.get('latest', True) 
        fromDay = data.get('fromDay', False)
        toDay = data.get('toDay', False)
        
        temp = data.get('temp', None)
        humidity = data.get('humidity', None)
        light = data.get('light', None)
        
        query = DataRealTime.query
        
        # Sắp xếp và phân trang kết quả
        if latest:
            query = query.order_by(DataRealTime.timestamp.desc())
        else:
            query = query.order_by(DataRealTime.timestamp.asc())

        if fromDay and toDay:
            query = query.filter(
                func.DATE(DataRealTime.timestamp).between(fromDay, toDay)
                )
        elif fromDay:
            query = query.filter(DataRealTime.timestamp >= fromDay)
        elif toDay:
            query = query.filter(DataRealTime.timestamp <= toDay)
            
        if temp is not None:
            query = query.filter(DataRealTime.temp.like(f"{temp}%"))
        if humidity is not None:
            query = query.filter(DataRealTime.humidity.like(f"{humidity}%"))
        if light is not None:
            query = query.filter(DataRealTime.light.like(f"{light}%"))
                
        data_paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
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
    
''' DEVICE '''
@app.route('/api/v1/device/status', methods=['GET'])
def device_status():
    try:
        devices = DeviceStatus.query.all()
        
        return jsonify([
            {
                'id': device.id,
                'device_name': device.device_name,
                'isOn': device.isOn
            }
            for device in devices
        ])
    except Exception as e:
        return jsonify(f"Error querying devices: {e}"), 500

@app.route('/api/v1/device/publish_cmd', methods=['POST'])
def publish_cmd():
    try:
        data = request.get_json()
        print(data)
        topic = topics_publish[data['topic']]
        cmd = commands[data['cmd']]
        mqtt.publish(topic, cmd)
        time.sleep(3)
        mqtt.unsubscribe(topic)
        
        return jsonify({
            'message': 'No Error'
        }), 200
    except Exception as e:
        # return {'error': e}, 500
        return {'error': 'invalid command'}, 500
    
@app.route('/api/v1/device/logs', methods=['POST'])
def device_logs():
    try:
        data = request.get_json()
        page = data.get('page', 1)
        per_page = data.get('per_page', 10)
        latest = data.get('latest', True) 
        fromDay = data.get('fromDay', False)
        toDay = data.get('toDay', False)
        
        query = DeviceHistory.query
        
        # Lọc theo khoảng thời gian từ fromDay đến toDay
        if fromDay and toDay:
            query = query.filter(
                func.DATE(DeviceHistory.timestamp).between(fromDay, toDay)
                )
        elif fromDay:
            query = query.filter(DeviceHistory.timestamp >= fromDay)
        elif toDay:
            query = query.filter(DeviceHistory.timestamp <= toDay)
            
        # Sắp xếp và phân trang kết quả
        if latest:
            query = query.order_by(DeviceHistory.timestamp.desc())
        else:
            query = query.order_by(DeviceHistory.timestamp.asc())

        data_paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            
        res = [data.to_dict() for data in data_paginated]
        return jsonify({
            'page': data_paginated.page,
            'per_page': data_paginated.per_page,
            'total': data_paginated.total,
            'pages': data_paginated.pages,
            'data': res
        }), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
    

''' ------------------------------------SOCKET-------------------------------'''

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    socketio.emit('response', 'hello client reply from '+data)
    

''' -------------------------------------MQTT------------------------------- '''

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    
    if rc == 0:
        client.subscribe(topics_subscribe['streaming/all'])
        
        client.subscribe(topics_subscribe['temperature'])
        client.subscribe(topics_subscribe['humidity'])
        client.subscribe(topics_subscribe['lights'])
        
        client.subscribe(topics_subscribe['fan'])
        client.subscribe(topics_subscribe['airConditioner'])
        client.subscribe(topics_subscribe['lightBulb'])
        client.subscribe(topics_subscribe['allDevice'])
        
    else:
        print(f"Failed to connect, return code {rc}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, msg):
    try:
        message = json.loads(msg.payload.decode())
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S %Y-%m-%d", t)  # Chuỗi thời gian

        custom_data = None

        topic = msg.topic
        if topic in ['streaming/all', 'temperature', 'humidity', 'lights']:
            print("Emit real time data: ", topic)
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
                timestamp = datetime.strptime(custom_data['message']['time'], "%H:%M:%S %Y-%m-%d")
                new_data = DataRealTime(temp=custom_data['message']['temp'],
                                        humidity=custom_data['message']['humidity'],
                                        light=custom_data['message']['light'],
                                        timestamp=timestamp)
                db.session.add(new_data)
                db.session.commit()
        else:
            print("mess_x: %s" % message)
            device_name = message['topic'].split('/')[0]
            cmd = message['cmd']
            status = message['status']
            note = None
            isOn = None
            if 'Successfully' in status:
                updateDevice = True
                note = status
            elif 'already off!' in status:
                note = device_name +' is already off!'
                updateDevice = False
                isOn = False
            elif 'already on!' in status:
                updateDevice = False
                isOn = True
                note = device_name + ' is already on!'
            else:
                updateDevice = False
                note = 'Some things went wrong'
            print(note)
            socketio.emit('device', {
                'device_name': device_name,
                'cmd': cmd,
                'status': note,
                'timestamp': current_time  # timestamp for real time data
            })
            
            # Cập nhập trạng thái của đèn
            with app.app_context(): 
                device = DeviceStatus.query.filter_by(device_name=device_name).first()
                if device:
                    # Cập nhật trạng thái isOn
                    if updateDevice:
                        device.isOn = not device.isOn
                    else:
                        if isOn is not None:
                            device.isOn = isOn
     
                    device.note = note
                    db.session.commit()
            
            # Cập nhập Log Action
            with app.app_context(): 
                timestamp = datetime.strptime(current_time, "%H:%M:%S %Y-%m-%d")
                new_log = DeviceHistory(device_name=topic, command=cmd, status=status, timestamp=timestamp)
                db.session.add(new_log)
                db.session.commit()
    
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
        if not DeviceStatus.query.first():
            fan = DeviceStatus(device_name='fan', isOn=False)
            airConditioner = DeviceStatus(device_name='airConditioner', isOn=False)
            lightBulb = DeviceStatus(device_name='lightBulb', isOn=False)
            allDevice = DeviceStatus(device_name='allDevice', isOn=False)
            
            db.session.add(fan)
            db.session.add(airConditioner)
            db.session.add(lightBulb)
            
            db.session.commit()
        
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=True, debug=True)