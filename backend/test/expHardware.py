from flask import Flask, jsonify, request
import paho.mqtt.client as mqtt

app = Flask(__name__)
data = {}

topics_subscribe = {
    'temperature': 'temperature',
    'fan_pub':'fan_pub',
    'airConditioner_pub':'airConditioner_pub',
    'lightBulb_pub':'lightBulb_pub'
}
topics_publish = {
    'temperature':'temperature',
    'Humidity':'Humidity',
    'Lights':'Lights',
    
    'fan_sub': 'fan_sub',
    'airConditioner_sub': 'airConditioner_sub',
    'lightBulb_sub': 'lightBulb_sub'
}

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(topics_subscribe['temperature'])
    
    client.subscribe(topics_subscribe['fan_pub'])
    client.subscribe(topics_subscribe['airConditioner_pub'])
    client.subscribe(topics_subscribe['lightBulb_pub'])

# Callback khi nhận thông điệp
def on_message(client, userdata, msg):
    global data
    data = msg.payload.decode()
    print(f"Received message: Command: {data} <- topic: {msg.topic}")
    client.publish(topics_publish['fan_sub'], 'success')
    print(f"Sent message: success")

# Tạo client MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Kết nối đến broker MQTT
client.connect("localhost", 1883, 60)
client.loop_start()

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({"data": data})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
