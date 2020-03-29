import datetime
from flask import Flask, jsonify
from flatten_curve.curves import get_time_series_data

def create_app():
    app = Flask(__name__, static_url_path='', static_folder='../static')

    @app.route("/cases.json")
    def cases():
        data = get_time_series_data()
        data.columns = list(map(str, data.columns.tolist()))

        country_cases = data.to_dict(orient="index")
        return jsonify(cases=country_cases, generated_at=datetime.datetime.utcnow())


    @app.route("/")
    def root():
        return app.send_static_file("index.html")

    return app
