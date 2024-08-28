import subprocess
import time
import random
import json

i = 1
while True:
    t = time.localtime()
    current_time = time.strftime("%H:%M:%S %m-%d-%Y", t)
    data = json.dumps({
        "temp": 28,
        "humidity": random.randint(83, 85),
        "light": random.randint(40, 42),
        "time": current_time
    })

    # Use subprocess.run to execute the command
    subprocess.run([
        "mosquitto_pub",
        "-h", "localhost",
        "-t", "streaming/all",
        "-m", data
    ])
    if i == 10:
        i = 1
    time.sleep(1)
