from flask import Flask, jsonify, render_template
import os

app = Flask(__name__)

APP_VERSION = os.getenv("APP_VERSION", "v1")
APP_NAME = os.getenv("APP_NAME", "SkyFly")

@app.route("/")
def home():
    return render_template("index.html", app_name=APP_NAME, version=APP_VERSION)

@app.route("/health")
def health():
    return jsonify(status="ok"), 200

@app.route("/version")
def version():
    return jsonify(app=APP_NAME, version=APP_VERSION), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
