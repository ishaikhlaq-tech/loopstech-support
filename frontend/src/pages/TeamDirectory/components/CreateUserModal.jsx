import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../api/client';
import toast from 'react-hot-toast';
import './CreateUserModal.css';

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        role: '',
        password: generatePassword()
      });
      setShowPassword(false);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }
    if (!formData.role) newErrors.role = 'System Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role.toLowerCase(), // 'admin'/'agent'/'customer'
        }),
      });
      toast.success('User created successfully!');
      onCreate();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2>Create New User</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        
        <div className="modal-divider"></div>

        {/* Form */}
        <div className="modal-form">
          <div className="form-group">
            <label>FULL NAME</label>
            <input 
              type="text" 
              name="name" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input 
              type="email" 
              name="email" 
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>TEMPORARY PASSWORD</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password}
                readOnly
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="form-helper">A strong temporary password is generated when this form opens.</span>
          </div>

          <div className="form-group">
            <label>SYSTEM ROLE</label>
            <div className="select-wrapper">
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                style={{ color: formData.role ? '#1C2333' : '#94A3B8' }}
              >
                <option value="" disabled hidden>Select role...</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="customer">Customer</option>
              </select>
              <ChevronDown className="select-chevron" size={20} strokeWidth={2.5} />
            </div>
            {errors.role && <span className="form-error">{errors.role}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-create" onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 size={14} className="animate-spin mr-1.5 inline" />}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateUserModal;
