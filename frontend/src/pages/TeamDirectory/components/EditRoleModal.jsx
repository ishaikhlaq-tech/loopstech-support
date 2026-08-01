import { useState } from 'react';
import { apiRequest } from '../../../api/client';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

const ROLES = ['customer', 'agent', 'admin'];

const ROLE_DESCRIPTIONS = {
  customer: 'Can submit and view their own tickets only.',
  agent: 'Can view all tickets, reply, and manage assignments.',
  admin: 'Full access — can manage users, roles, and all tickets.',
};

const EditRoleModal = ({ user, onClose, onUpdated }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (selectedRole === user.role) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/users/${user.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: selectedRole }),
      });
      toast.success(`Role updated to ${selectedRole}`);
      onUpdated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A]">Edit User Role</h3>
            <p className="text-[12px] text-[#64748B] mt-0.5">{user.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>

        {/* Role Options */}
        <div className="flex flex-col gap-3 mb-6">
          {ROLES.map((role) => (
            <label
              key={role}
              className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === role
                  ? 'border-[#0F766E] bg-[#F0FDFA]'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="mt-0.5 accent-[#0F766E]"
              />
              <div>
                <p className="text-[13px] font-bold text-[#0F172A] capitalize">{role}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-bold text-[#475569] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-bold text-white bg-[#0F766E] rounded-lg hover:bg-[#0D9488] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Saving...' : 'Save Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
