import json  # leads handler
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Сохранение заявок с сайта и получение списка заявок для админки."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute("SELECT id, name, phone, contact_method, created_at FROM leads ORDER BY created_at DESC")
        rows = cur.fetchall()
        leads = [
            {'id': r[0], 'name': r[1], 'phone': r[2], 'contact_method': r[3], 'created_at': r[4].isoformat()}
            for r in rows
        ]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'leads': leads})}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    contact_method = body.get('contact_method', '').strip()

    if not name or not phone:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Имя и телефон обязательны'})}

    cur.execute(
        "INSERT INTO leads (name, phone, contact_method) VALUES (%s, %s, %s) RETURNING id",
        (name, phone, contact_method)
    )
    lead_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True, 'id': lead_id})}