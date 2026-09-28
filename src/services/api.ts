const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredBaseUrl) {
  throw new Error('VITE_API_URL is missing. Set it in the frontend environment before building.');
}

if (!/^https?:\/\/[^/]+/i.test(configuredBaseUrl)) {
  throw new Error('VITE_API_URL must be a complete http(s) URL for the Express backend.');
}

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');
export const AUTH_API_URL = `${API_BASE_URL}/api`;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  status?: 'active' | 'inactive';
  propertyCount?: number;
  createdAt?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

interface MeResponse {
  success: boolean;
  admin: AdminUser;
}

async function requestJson<T>(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<T> {
  const start = Date.now();
  const controller = new AbortController();

  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (import.meta.env.DEV) {
      console.log('[AUTH] Request started', { url, timestamp: new Date().toISOString() });
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    let body: unknown = null;

    if (contentType.includes('application/json')) {
      body = await response.json().catch(() => null);
    } else {
      const text = await response.text();
      body = text || null;
    }

    if (import.meta.env.DEV) {
      console.log('[AUTH] Response received', {
        url,
        status: response.status,
        duration: `${Date.now() - start}ms`,
      });
    }

    if (!response.ok) {
      const message = typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message?: string }).message || 'Request failed')
        : typeof body === 'string' && body
          ? body
          : 'Request failed';

      if (response.status === 401) {
        throw new Error(message || 'Invalid email or password');
      }

      if (response.status === 403) {
        throw new Error(message || 'Authentication is not permitted');
      }

      if (response.status === 404) {
        throw new Error(message || 'Request not found');
      }

      if (response.status >= 500) {
        throw new Error(message || 'Authentication server error');
      }

      throw new Error(message || 'Request failed');
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Authentication server took too long to respond.');
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to connect to authentication server. Please make sure the server is running.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Authentication server error');
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return requestJson<AuthResponse>(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
}

export async function getCurrentAdmin(token: string) {
  return requestJson<MeResponse>(`${AUTH_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPublicCollection<T>(resource: string) {
  return requestJson<{ success: boolean; data: T[] }>(`${AUTH_API_URL}/${resource}`);
}

export async function getCategories() {
  return requestJson<{ success: boolean; data: Category[] }>(`${AUTH_API_URL}/categories`);
}

export async function getAdminCategories(token: string) {
  return requestJson<{ success: boolean; data: Category[] }>(`${AUTH_API_URL}/categories/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createCategory(payload: { name: string; status: 'active' | 'inactive' }, token: string) {
  return requestJson<{ success: boolean; data: Category }>(`${AUTH_API_URL}/categories`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload)
  });
}

export async function updateCategory(id: string, payload: { name: string; status: 'active' | 'inactive' }, token: string) {
  return requestJson<{ success: boolean; data: Category }>(`${AUTH_API_URL}/categories/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload)
  });
}

export async function deleteCategory(id: string, token: string) {
  return requestJson<{ success: boolean }>(`${AUTH_API_URL}/categories/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createEnquiry(payload: Record<string, unknown>) {
  return requestJson<{ success: boolean; data: { id: string } }>(`${AUTH_API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getAdminCollection<T>(resource: string, token: string) {
  return requestJson<{ success: boolean; data: T[] }>(`${AUTH_API_URL}/${resource}/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createAdminRecord<T>(resource: string, payload: Record<string, unknown>, token: string) {
  return requestJson<{ success: boolean; data: T }>(`${AUTH_API_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function uploadProjectImage(file: File, token: string, onProgress?: (progress: number) => void) {
  return new Promise<{ success: boolean; data: { url: string; alt: string; isFeatured: boolean; order: number } }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${AUTH_API_URL}/uploads/project-image`);
    request.timeout = 60_000;
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener('load', () => {
      let body: { success?: boolean; message?: string; data?: { url: string; alt: string; isFeatured: boolean; order: number } };
      try {
        body = JSON.parse(request.responseText || '{}') as typeof body;
      } catch {
        reject(new Error('Upload failed. Please try again.'));
        return;
      }
      if (request.status >= 200 && request.status < 300 && body.success && body.data?.url) {
        resolve(body);
      } else {
        reject(new Error(body.message || 'Unable to upload image.'));
      }
    });
    request.addEventListener('error', () => reject(new Error('Unable to upload image.')));
    request.addEventListener('timeout', () => reject(new Error('Upload timed out. Please try again.')));
    request.addEventListener('abort', () => reject(new Error('Image upload was cancelled.')));

    const formData = new FormData();
    formData.append('image', file);
    request.send(formData);
  });
}

export async function updateAdminRecord<T>(resource: string, id: string, payload: Record<string, unknown>, token: string) {
  return requestJson<{ success: boolean; data: T }>(`${AUTH_API_URL}/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminRecord(resource: string, id: string, token: string) {
  return requestJson<{ success: boolean }>(`${AUTH_API_URL}/${resource}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDashboardStats(token: string) {
  return requestJson<{ success: boolean; data: { properties: number; projects: number; blogs: number; newEnquiries: number } }>(`${AUTH_API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
