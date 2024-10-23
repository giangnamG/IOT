from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class DataRealTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temp = db.Column(db.Integer, nullable=False)
    humidity = db.Column(db.Integer, nullable=False)
    light = db.Column(db.Integer, nullable=False)
    dust = db.Column(db.Integer, nullable=False)
    rain = db.Column(db.Integer, nullable=False)
    wind = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime(50), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'temp': self.temp,
            'humidity': self.humidity,
            'light': self.light,
            'dust': self.dust,
            'wind': self.wind,
            'rain': self.rain,
            'timestamp': self.timestamp
        }

class DeviceHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.String(50), nullable=False)
    command = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime(50), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_name': self.device_name,
            'command': self.command,
            'status': self.status,
            'timestamp': self.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }

# class WarningSensorLog(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     sensor_name = db.Column(db.String(50))
    
class WarningSensorCount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sensor_name = db.Column(db.String(50))
    count = db.Column(db.Integer, default=0)
    isWarning = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sensor_name': self.sensor_name,
            'count': self.count,
            'isWarning': self.isWarning
        }