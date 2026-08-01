import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../api/client';
import toast from 'react-hot-toast';
import './CreateUserModal.css';

const EditUserModal = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: user.full_name || user.email.split('@')[0],
    email: user.email,
    role: user.role,
    status: 'Active',
    department: user.department || 'No Department',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update profile (role, department, full_name)
      await apiRequest(`/users/${user.id}/profile`, {
        method: 'PATCH',
        body: JSON.stringify({
          role: formData.role,
          department: formData.department,
          full_name: formData.name
        }),
      });

      // Reset password if provided
      if (formData.password.trim()) {
        await apiRequest(`/users/${user.id}/password`, {
          method: 'PATCH',
          body: JSON.stringify({ password: formData.password }),
        });
      }

      toast.success('User updated successfully!');
      onUpdated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2>Edit User Details</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-divider" />

        {/* Form */}
        <div className="modal-form">

          {/* Full Name */}
          <div className="form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              style={{ background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
            />
          </div>

          {/* System Role + Access Status (2 cols) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>SYSTEM ROLE</label>
              <div className="select-wrapper">
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="admin">ADMIN</option>
                  <option value="agent">AGENT</option>
                  <option value="customer">CUSTOMER</option>
                </select>
                <ChevronDown className="select-chevron" size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="form-group">
              <label>ACCESS STATUS</label>
              <div className="select-wrapper">
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <ChevronDown className="select-chevron" size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="form-group">
            <label>DEPARTMENT</label>
            <div className="select-wrapper">
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="No Department">No Department</option>
                <option value="IT Support">IT Support</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              <ChevronDown className="select-chevron" size={20} strokeWidth={2.5} />
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label>NEW PASSWORD</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="form-helper">Fill this only when the user needs a password reset.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn-create"
            onClick={handleSave}
            disabled={loading}
            style={{ width: 130 }}
          >
            {loading && <Loader2 size={14} style={{ display: 'inline', marginRight: 6, animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUserModal;
