import subprocess
import threading

''' ---------------------------Start BROKER SERVER-------------------------------'''

def start_mosquitto():
    config_path = r"D:\AppData\mosquitto\mosquitto.conf"
    try:
        subprocess.run(['mosquitto', '-c', config_path], check=True)
        print("Mosquitto started successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to start Mosquitto: {e}")

threading.Thread(target=start_mosquitto).start()