export { authHeaders } from '../admin/utils';

export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  DRAFT:     { label: 'Draft',     className: 'bg-slate-100 text-slate-600' },
  SUBMITTED: { label: 'Submitted', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED:  { label: 'Approved',  className: 'bg-green-100 text-green-700' },
  REJECTED:  { label: 'Rejected',  className: 'bg-red-100 text-red-700' },
};
