const LEADS_URL = 'https://functions.poehali.dev/ed1179be-28aa-48f1-96e8-c89096907a25'

export async function apiSubmitLead(name: string, phone: string, contact_method: string) {
  return fetch(LEADS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, contact_method }),
  }).then(r => r.json())
}

export async function apiGetLeads() {
  return fetch(LEADS_URL).then(r => r.json())
}