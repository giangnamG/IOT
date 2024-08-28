import os, json, time
from dotenv import load_dotenv
import threading, requests
from topics import * 
from flask import Flask, request, jsonify
from flask_mqtt import Mqtt
from flask_cors import CORS

load_dotenv()

# Global variable to keep track of the publish status
publish_status = {'status': None, 'message': None}
subscribe_status = {'status': None, 'topic':None, 'message': None}


# Khởi tạo ứng dụng Flask và cấu hình MQTT
app = Flask(__name__)

CORS(app, resources={r"/api/v1/*": {"origins": "*"}}, supports_credentials=True)

app.config['MQTT_BROKER_URL'] = os.getenv('MQTT_BROKER_URL')  
app.config['MQTT_BROKER_PORT'] = int(os.getenv('MQTT_BROKER_PORT')  )
app.config['MQTT_USERNAME'] = os.getenv('MQTT_USERNAME')
app.config['MQTT_PASSWORD'] = os.getenv('MQTT_PASSWORD')
app.config['MQTT_KEEPALIVE'] = int(os.getenv('MQTT_KEEPALIVE'))
app.config['MQTT_TLS_ENABLED'] = os.getenv('MQTT_TLS_ENABLED') == 'True'

SOCKET_URL = os.getenv('SOCKET_URL')

PORT = os.getenv('PORT')

mqtt = Mqtt(app)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Connected with result code {rc}")
        client.subscribe(topics_subscribe['streaming/all'])
        client.subscribe(topics_subscribe['temperature'])
        client.subscribe(topics_subscribe['humidity'])
        client.subscribe(topics_subscribe['lights'])
        client.subscribe(topics_subscribe['fan'])
    else:
        print(f"Failed to connect, return code {rc}")
@mqtt.on_message()
def handle_mqtt_message(client, userdata, msg):
    global subscribe_status
    try:
        message = json.loads(msg.payload.decode())
        t = time.localtime()
        current_time = time.strftime("%H:%M:%S %m-%d-%Y", t)
        custom_data = {
            'topic': msg.topic,
            'message': {
                'time': current_time,
                'temp': message['temp'],
                'humidity': message['humidity'],
                'light': message['light'],
            }
        }
        topic = msg.topic
        if topic in ['streaming/all','temperature', 'humidity', 'lights']:
            # Khởi động thread để gửi dữ liệu tới server Flask socket
            thread = threading.Thread(target=publish_to_socket, args=(custom_data,))
            thread.start()
            subscribe_status['status'] = 'received'
            subscribe_status['topic'] = topic
        else:
            subscribe_status['status'] = 'received'
            subscribe_status['topic'] = topic
            
        print("subscribe_status command: ", subscribe_status)
    except Exception as e:
        print("Error processing message: ", e)
        print(f"Invalid topic: {msg.topic}")

def publish_to_socket(message):
    try:
        response = requests.post(url=SOCKET_URL, json=message)
        print(f"response from server: {response.status_code}")
    except Exception as e:
        print(f"Failed to publish to server: {e}")

@app.route('/api/v1/publish_cmd', methods=['POST'])
def publish_cmd():
    try:
        data = request.get_json()
        print("publish_cmd command")
        topic = topics_publish[data['topic']]
        cmd = commands[data['cmd']]
        mqtt.publish(topic, cmd)
        
        mqtt.unsubscribe(topic)
        return jsonify({
            'message': 'Command published successfully',
            'topic': topic,
            'cmd': cmd
            })
    except Exception as e:
        return {'error': 'some thing went wrong'}, 500

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
