from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class DataRealTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temp = db.Column(db.Integer, nullable=False)
    humidity = db.Column(db.Integer, nullable=False)
    light = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.String(50), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'temp': self.temp,
            'humidity': self.humidity,
            'light': self.light,
            'timestamp': self.timestamp
        }

class DeviceHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.String(50), nullable=False)
    command = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.String(50), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_name': self.device_name,
            'command': self.command,
            'status': self.status,
            'timestamp': self.timestamp
        }

class DeviceStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.String(50), nullable=False)
    isOn = db.Column(db.Boolean, default=False)
    note = db.Column(db.String(50), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_name': self.device_name,
            'isOn': self.isOn,
            'note': self.note
        }