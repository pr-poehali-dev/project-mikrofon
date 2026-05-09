const AUTH_URL = 'https://functions.poehali.dev/a5f8ea94-8c54-4dc6-acd1-c3ffa9daddea'
const CONTENT_URL = 'https://functions.poehali.dev/c348273a-22f3-4739-919c-6dff12bba843'

export const TOKEN_KEY = 'admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

function post(url: string, body: Record<string, unknown>, token?: string) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Session-Id': token } : {}),
    },
    body: JSON.stringify(body),
  }).then(r => r.json())
}

export async function apiLogin(username: string, password: string) {
  return post(AUTH_URL, { action: 'login', username, password })
}

export async function apiCheckToken(token: string) {
  return post(AUTH_URL, { action: 'check', token })
}

export async function apiChangePassword(password: string) {
  return post(AUTH_URL, { action: 'change-password', password }, getToken())
}

export async function apiGetContent() {
  return fetch(`${CONTENT_URL}?resource=content`).then(r => r.json())
}

export async function apiSaveContent(sections: Record<string, Record<string, string>>) {
  return post(CONTENT_URL, { action: 'save-content', sections }, getToken())
}

export async function apiGetProjects() {
  return fetch(`${CONTENT_URL}?resource=projects`).then(r => r.json())
}

export async function apiSaveProject(id: number | null, data: Record<string, unknown>) {
  return post(CONTENT_URL, { action: 'save-project', ...data, id: id || undefined }, getToken())
}

export async function apiDeleteProject(id: number) {
  return post(CONTENT_URL, { action: 'delete-project', id }, getToken())
}

export async function apiGetReviews() {
  return fetch(`${CONTENT_URL}?resource=reviews`).then(r => r.json())
}

export async function apiSaveReview(id: number | null, data: Record<string, unknown>) {
  return post(CONTENT_URL, { action: 'save-review', ...data, id: id || undefined }, getToken())
}

export async function apiDeleteReview(id: number) {
  return post(CONTENT_URL, { action: 'delete-review', id }, getToken())
}

export async function apiUploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      const json = await post(CONTENT_URL, { action: 'upload-image', data: base64, filename: file.name }, getToken())
      if (json.url) resolve(json.url)
      else reject(new Error(json.error || 'Ошибка загрузки'))
    }
    reader.readAsDataURL(file)
  })
}
