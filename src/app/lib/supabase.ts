const SUPABASE_URL = 'https://ipihtrvjlpyhueazwnph.supabase.co';

async function supabaseFetch(path: string, body: any) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Supabase error ${res.status}`);
  }
  return res.json();
}

export function saveOrder(order: any) {
  return supabaseFetch('/rest/v1/orders', order);
}

export function savePreference(pref: any) {
  return supabaseFetch('/rest/v1/preferences', pref);
}
