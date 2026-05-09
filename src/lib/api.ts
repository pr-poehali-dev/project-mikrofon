const AUTH_URL = 'https://functions.poehali.dev/a5f8ea94-8c54-4dc6-acd1-c3ffa9daddea'
const CONTENT_URL = 'https://functions.poehali.dev/c348273a-22f3-4739-919c-6dff12bba843'

export const TOKEN_KEY = 'admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return res.json()
}

export async function apiCheckToken(token: string) {
  const res = await fetch(`${AUTH_URL}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return res.json()
}

export async function apiChangePassword(password: string) {
  const res = await fetch(`${AUTH_URL}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
    body: JSON.stringify({ password }),
  })
  return res.json()
}

export async function apiGetContent() {
  const res = await fetch(`${CONTENT_URL}/content`)
  return res.json()
}

export async function apiSaveContent(sections: Record<string, Record<string, string>>) {
  const res = await fetch(`${CONTENT_URL}/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
    body: JSON.stringify({ sections }),
  })
  return res.json()
}

export async function apiGetProjects() {
  const res = await fetch(`${CONTENT_URL}/projects`)
  return res.json()
}

export async function apiSaveProject(id: number | null, data: Record<string, unknown>) {
  if (id) {
    const res = await fetch(`${CONTENT_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
      body: JSON.stringify(data),
    })
    return res.json()
  } else {
    const res = await fetch(`${CONTENT_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
      body: JSON.stringify(data),
    })
    return res.json()
  }
}

export async function apiDeleteProject(id: number) {
  const res = await fetch(`${CONTENT_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'X-Session-Id': getToken() },
  })
  return res.json()
}

export async function apiGetReviews() {
  const res = await fetch(`${CONTENT_URL}/reviews`)
  return res.json()
}

export async function apiSaveReview(id: number | null, data: Record<string, unknown>) {
  if (id) {
    const res = await fetch(`${CONTENT_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
      body: JSON.stringify(data),
    })
    return res.json()
  } else {
    const res = await fetch(`${CONTENT_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
      body: JSON.stringify(data),
    })
    return res.json()
  }
}

export async function apiDeleteReview(id: number) {
  const res = await fetch(`${CONTENT_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: { 'X-Session-Id': getToken() },
  })
  return res.json()
}

export async function apiUploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      const res = await fetch(`${CONTENT_URL}/upload-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Id': getToken() },
        body: JSON.stringify({ data: base64, filename: file.name }),
      })
      const json = await res.json()
      if (json.url) resolve(json.url)
      else reject(new Error(json.error || 'Ошибка загрузки'))
    }
    reader.readAsDataURL(file)
  })
}
