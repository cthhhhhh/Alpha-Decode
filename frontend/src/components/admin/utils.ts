export const ROLE_COLOR: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  CONTRIBUTOR: 'bg-blue-100 text-blue-700',
  USER: 'bg-slate-100 text-slate-600',
};

export function authHeaders() {
  return { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
    'Content-Type': 'application/json' 
  };
}

export const formatReason = (r: string) =>
  r.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
