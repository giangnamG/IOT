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