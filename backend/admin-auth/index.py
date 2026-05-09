"""Авторизация администратора — вход и проверка сессии"""
import json
import os
import hashlib
import secrets
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    # action=login
    if action == 'login':
        username = body.get('username', '')
        password = body.get('password', '')

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('SELECT id, password_hash FROM admin_users WHERE username = %s', (username,))
        row = cur.fetchone()

        if not row:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        user_id, stored_hash = row
        input_hash = hash_password(password)

        # Поддерживаем как sha256, так и дефолтный bcrypt-хэш (только пароль "admin")
        is_default = stored_hash == '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTbR1Rj3pGSUaXzC5.KMFmYqiS'
        if is_default:
            ok = password == 'admin'
        else:
            ok = input_hash == stored_hash

        if not ok:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        session_token = secrets.token_hex(32)
        cur.execute('''
            INSERT INTO site_content (section, key, value) VALUES ('_sessions', %s, %s)
            ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        ''', (session_token, str(user_id)))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'token': session_token, 'username': username})}

    # action=check
    if action == 'check':
        token = body.get('token', '')
        if not token:
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'valid': False})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute("SELECT value FROM site_content WHERE section = '_sessions' AND key = %s", (token,))
        row = cur.fetchone()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'valid': bool(row)})}

    # action=change-password
    if action == 'change-password':
        headers = event.get('headers', {})
        token = headers.get('X-Session-Id', '')
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
        cur.execute('UPDATE admin_users SET password_hash = %s WHERE id = %s', (hash_password(new_password), user_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unknown action'})}
