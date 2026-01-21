topics_publish = {
    'fan':'fan/pub',
    'airConditioner':'airConditioner/pub',
    'lightBulb':'lightBulb/pub',
    'allDevice':'allDevice/pub',
    'led':'led/pub',
    'deviceStatus':'deviceStatus/pub',
}
topics_subscribe = {
    'streaming/all':'streaming/all',
    
    'temperature':'temperature',
    'humidity':'humidity',
    'lights':'lights',
    'allDevice': 'allDevice/sub',
    'deviceStatus': 'deviceStatus/sub',
    
    'led': 'led/sub',
    'fan': 'fan/sub',
    'airConditioner': 'airConditioner/sub',
    'lightBulb': 'lightBulb/sub'
}
commands = {
    'turnOn': 'ON',
    'turnOff': 'OFF',
}

sensors = {
    'temp' : {
        'label': 'Nhiệt Độ',
        'threshold': 50
    }
    ,
    'humidity' : {
        'label': 'Độ Ẩm',
        'threshold': 80
    },
    'light':{
        'label': 'Ánh Sáng',
        'threshold': 500
    },
    'dust' : {
        'label': 'Độ Bụi',
        'threshold': 70
    },
    'windSpeed' : {
        'label': 'Tốc Độ Gió',
        'threshold': 10
    },
    'rain' : {
        'label': 'Mức Mưa',
        'threshold': 50
    }
}
