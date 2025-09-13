from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data
items = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"},
    {"id": 3, "name": "Item 3"}
]

# Root endpoint
@app.route('/')
def home():
    return "Welcome to the Flask API!"

# Get all items
@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({"items": items})

# Get a specific item by ID
@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = next((item for item in items if item["id"] == item_id), None)
    if item is None:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"item": item})

# Add a new item
@app.route('/api/items', methods=['POST'])
def add_item():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    if 'name' not in data:
        return jsonify({"error": "Missing 'name' in request"}), 400
    
    new_item = {
        "id": len(items) + 1,
        "name": data['name']
    }
    items.append(new_item)
    
    return jsonify({"item": new_item}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
