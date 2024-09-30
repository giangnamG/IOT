from flask import Flask,jsonify
from flasgger import Swagger
from flask_cors import CORS

app = Flask(__name__)

# Cấu hình CORS cho phép các yêu cầu từ localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

swagger = Swagger(app)

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
        {"id": 1, "name": "John Doe"},
        {"id": 2, "name": "Jane Doe"}
    ]
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)
