"""Управление контентом сайта: тексты, проекты, отзывы"""
import json
import os
import psycopg2
import boto3
import base64
import uuid

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def check_auth(event):
    headers = event.get('headers', {})
    token = headers.get('X-Session-Id', '')
    if not token:
        return False
    conn = get_db()
    cur = conn.cursor()
    cur.execute(f'SET search_path TO "{SCHEMA}"')
    cur.execute("SELECT value FROM site_content WHERE section = '_sessions' AND key = %s", (token,))
    row = cur.fetchone()
    conn.close()
    return bool(row)

def upload_image(data_b64: str, filename: str) -> str:
    data = base64.b64decode(data_b64)
    ext = filename.rsplit('.', 1)[-1] if '.' in filename else 'jpg'
    key = f'admin/{uuid.uuid4()}.{ext}'
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    content_types = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_types.get(ext, 'image/jpeg'))
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    # GET /content — публичный, читают все компоненты сайта
    if method == 'GET' and path.endswith('/content'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute("SELECT section, key, value FROM site_content WHERE section != '_sessions'")
        rows = cur.fetchall()
        conn.close()
        result = {}
        for section, key, value in rows:
            if section not in result:
                result[section] = {}
            result[section][key] = value
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(result)}

    # GET /projects — публичный
    if method == 'GET' and path.endswith('/projects'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('SELECT id, title, category, area, style, price, duration, image, gallery, sort_order FROM site_projects ORDER BY sort_order')
        rows = cur.fetchall()
        conn.close()
        cols = ['id','title','category','area','style','price','duration','image','gallery','sort_order']
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps([dict(zip(cols, r)) for r in rows])}

    # GET /reviews — публичный
    if method == 'GET' and path.endswith('/reviews'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('SELECT id, author, location, text, rating, sort_order FROM site_reviews ORDER BY sort_order')
        rows = cur.fetchall()
        conn.close()
        cols = ['id','author','location','text','rating','sort_order']
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps([dict(zip(cols, r)) for r in rows])}

    # Всё ниже — только для авторизованных
    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    body = json.loads(event.get('body') or '{}')

    # POST /upload-image
    if method == 'POST' and '/upload-image' in path:
        image_data = body.get('data', '')
        filename = body.get('filename', 'image.jpg')
        url = upload_image(image_data, filename)
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'url': url})}

    # PUT /content — сохранить текстовые настройки
    if method == 'PUT' and '/content' in path:
        sections = body.get('sections', {})
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        for section, keys in sections.items():
            for key, value in keys.items():
                cur.execute('''
                    INSERT INTO site_content (section, key, value) VALUES (%s, %s, %s)
                    ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
                ''', (section, key, value))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # POST /projects — создать проект
    if method == 'POST' and path.endswith('/projects'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('''
            INSERT INTO site_projects (title, category, area, style, price, duration, image, gallery, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, (SELECT COALESCE(MAX(sort_order),0)+1 FROM site_projects))
            RETURNING id
        ''', (body.get('title',''), body.get('category',''), body.get('area',''),
              body.get('style',''), body.get('price',''), body.get('duration',''),
              body.get('image',''), body.get('gallery',[])))
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    # PUT /projects/<id> — обновить проект
    if method == 'PUT' and '/projects/' in path:
        project_id = int(path.split('/')[-1])
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('''
            UPDATE site_projects SET title=%s, category=%s, area=%s, style=%s, price=%s,
            duration=%s, image=%s, gallery=%s, sort_order=%s, updated_at=NOW() WHERE id=%s
        ''', (body.get('title',''), body.get('category',''), body.get('area',''),
              body.get('style',''), body.get('price',''), body.get('duration',''),
              body.get('image',''), body.get('gallery',[]), body.get('sort_order',0), project_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # DELETE /projects/<id>
    if method == 'DELETE' and '/projects/' in path:
        project_id = int(path.split('/')[-1])
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('DELETE FROM site_projects WHERE id = %s', (project_id,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # POST /reviews — создать отзыв
    if method == 'POST' and path.endswith('/reviews'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('''
            INSERT INTO site_reviews (author, location, text, rating, sort_order)
            VALUES (%s, %s, %s, %s, (SELECT COALESCE(MAX(sort_order),0)+1 FROM site_reviews))
            RETURNING id
        ''', (body.get('author',''), body.get('location',''), body.get('text',''), body.get('rating',5)))
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    # PUT /reviews/<id>
    if method == 'PUT' and '/reviews/' in path:
        review_id = int(path.split('/')[-1])
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('''
            UPDATE site_reviews SET author=%s, location=%s, text=%s, rating=%s, sort_order=%s, updated_at=NOW()
            WHERE id=%s
        ''', (body.get('author',''), body.get('location',''), body.get('text',''),
              body.get('rating',5), body.get('sort_order',0), review_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # DELETE /reviews/<id>
    if method == 'DELETE' and '/reviews/' in path:
        review_id = int(path.split('/')[-1])
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SET search_path TO "{SCHEMA}"')
        cur.execute('DELETE FROM site_reviews WHERE id = %s', (review_id,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
