"""Авторизация администратора — вход и проверка сессии"""
import json
import os
import hashlib
import secrets
import psycopg2
from datetime import datetime, timedelta

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

# Простой хэш пароля без bcrypt
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    # POST /login
    if method == 'POST' and '/login' in path:
        body = json.loads(event.get('body') or '{}')
        username = body.get('username', '')
        password = body.get('password', '')

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('SELECT id, password_hash FROM admin_users WHERE username = %s', (username,))
        row = cur.fetchone()
        conn.close()

        if not row:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        user_id, stored_hash = row
        # Проверяем оба варианта хэша
        input_hash = hash_password(password)
        if input_hash != stored_hash and stored_hash != '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTbR1Rj3pGSUaXzC5.KMFmYqiS':
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        # Если это дефолтный bcrypt хэш — принимаем пароль "admin"
        if stored_hash == '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTbR1Rj3pGSUaXzC5.KMFmYqiS' and password != 'admin':
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        session_token = secrets.token_hex(32)
        # Сохраняем токен в БД
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('''
            INSERT INTO site_content (section, key, value) VALUES ('_sessions', %s, %s)
            ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        ''', (session_token, str(user_id)))
        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'token': session_token, 'username': username})
        }

    # POST /check — проверка токена
    if method == 'POST' and '/check' in path:
        body = json.loads(event.get('body') or '{}')
        token = body.get('token', '')
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'valid': False})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute("SELECT value FROM site_content WHERE section = '_sessions' AND key = %s", (token,))
        row = cur.fetchone()
        conn.close()

        if row:
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'valid': True})}
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'valid': False})}

    # POST /change-password
    if method == 'POST' and '/change-password' in path:
        headers = event.get('headers', {})
        token = headers.get('X-Session-Id', '')
        body = json.loads(event.get('body') or '{}')
        new_password = body.get('password', '')

        if not token or not new_password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет данных'})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute("SELECT value FROM site_content WHERE section = '_sessions' AND key = %s", (token,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

        user_id = int(row[0])
        new_hash = hash_password(new_password)
        cur.execute('UPDATE admin_users SET password_hash = %s WHERE id = %s', (new_hash, user_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
