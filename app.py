from flask import Flask, send_from_directory, jsonify, make_response
import os

app = Flask(__name__)

# Имя вашего JSON-файла
JSON_FILENAME = "start.json"

@app.after_request
def after_request(response):
    """
    Добавляет обязательный заголовок CORS к каждому ответу.
    """
    # Разрешаем доступ с любого домена (*)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/content.json')
def content():
    """
    Обрабатывает запрос на корневой адрес (/) и отдает JSON-файл.
    """
    try:
        # Пытаемся открыть и прочитать ваш JSON-файл
        with open(JSON_FILENAME, 'r', encoding='utf-8') as f:
            data = f.read()
        
        # Создаем ответ
        response = make_response(data)
        
        # Устанавливаем правильный MIME-тип для JSON
        response.headers['Content-Type'] = 'application/json'
        
        return response
    
    except FileNotFoundError:
        # Если файл не найден, возвращаем ошибку 404
        return jsonify({"error": f"Файл {JSON_FILENAME} не найден на сервере"}), 404

@app.route('/msx/start.json')
def serve_msx_config():
    """
    Обрабатывает запрос на корневой адрес (/) и отдает JSON-файл.
    """
    try:
        # Пытаемся открыть и прочитать ваш JSON-файл
        with open(JSON_FILENAME, 'r', encoding='utf-8') as f:
            data = f.read()
        
        # Создаем ответ
        response = make_response(data)
        
        # Устанавливаем правильный MIME-тип для JSON
        response.headers['Content-Type'] = 'application/json'
        
        return response
    
    except FileNotFoundError:
        # Если файл не найден, возвращаем ошибку 404
        return jsonify({"error": f"Файл {JSON_FILENAME} не найден на сервере"}), 404

# Flask автоматически обрабатывает запросы к папке /static
# (для изображений, если они есть в JSON)
app.run(host='0.0.0.0')
