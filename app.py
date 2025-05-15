from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_mail import Mail, Message
import os
import sqlite3

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

def get_db():
    conn = sqlite3.connect('feedback.db')
    conn.row_factory = sqlite3.Row
    return conn

# Serve your main page
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Example API endpoint for feedback
@app.route('/api/feedback', methods=['POST'])
def feedback():
    data = request.json
    name = data.get('name')
    message = data.get('message')
    db = get_db()
    db.execute('INSERT INTO feedback (name, message) VALUES (?, ?)', (name, message))
    db.commit()
    print(f"Feedback received: {name} - {message}")
    return jsonify({'success': True})

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    db = get_db()
    feedbacks = db.execute('SELECT * FROM feedback ORDER BY id DESC').fetchall()
    return jsonify([dict(row) for row in feedbacks])

# Serve static files (CSS, JS, images)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    msg = Message(subject="New Contact Message",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=['your_email@gmail.com'],
                  body=f"From: {data['name']} <{data['email']}>\n\n{data['message']}")
    mail.send(msg)
    return jsonify({'success': True})

@app.route('/admin')
def admin():
    # Fetch data from DB
    feedbacks = [...]  # Replace with DB query
    return render_template('admin.html', feedbacks=feedbacks)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

function sendContact(name, email, message) {
  fetch('/api/contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email, message})
  }).then(res => res.json())
    .then(data => alert(data.success ? 'Sent!' : 'Error!'));
}