import { useState, useEffect } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { Plus, Edit2, Ban, Trash2, Loader2 } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import './TeamDirectoryPage.css';

// Role → row color scheme (same as original)
const ROLE_STYLES = {
  admin:      { rowBg: '#EAFBF5', hoverBg: '#DDF7EF', leftBorder: '#14B8A6' },
  agent:      { rowBg: '#EDF5FF', hoverBg: '#E3EEFF', leftBorder: '#2563EB' },
  customer:   { rowBg: '#FFF8E4', hoverBg: '#FFF2CC', leftBorder: '#F59E0B' },
  supervisor: { rowBg: '#FFF0F3', hoverBg: '#FFE6EC', leftBorder: '#EF4444' },
};

const ROLE_BADGE_STYLES = {
  admin:      { bg: '#FDE8D8', color: '#C2410C' },
  agent:      { bg: '#D1FAE5', color: '#065F46' },
  customer:   { bg: '#FEF3C7', color: '#92400E' },
  supervisor: { bg: '#FEE2E2', color: '#991B1B' },
};

const RoleBadge = ({ role }) => {
  const s = ROLE_BADGE_STYLES[role] || ROLE_BADGE_STYLES.customer;
  return (
    <div className="team-role-badge" style={{ backgroundColor: s.bg, color: s.color }}>
      {role.toUpperCase()}
    </div>
  );
};

const TeamDirectoryPage = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser]   = useState(null);
  const { user } = useAuth();
  const isAdmin = (user?.app_role || user?.role) === 'admin';

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/users');
      setUsers(data.users || []);
    } catch (err) {
      setUsers([]);
      setError(err.message);
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    try {
      await apiRequest(`/users/${user.id}`, { method: 'DELETE' });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getDisplayName = (user) =>
    user.full_name || user.email.split('@')[0].replace(/[._]/g, ' ');

  return (
    <DashboardLayout title="Team Directory">
      <div className="team-directory-page">
        {/* Page Header */}
        <div className="team-header">
          <div className="team-header__left">
            <h2 className="team-header__title">Team Directory</h2>
            <p className="team-header__subtitle">Manage team accounts, access, and assigned modules.</p>
          </div>
          {isAdmin && (
            <button className="team-header__btn" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} strokeWidth={2.5} />
              Create User
            </button>
          )}
        </div>

        {/* Main Table Card */}
        <div className="team-table-card">
          <div className="team-table-scroll-container">
            <div className="team-table">

              {/* Table Header */}
              <div className="team-table__header">
                <div className="th-col th-name">FULL NAME</div>
                <div className="th-col th-email">EMAIL</div>
                <div className="th-col th-role">ROLE</div>
                <div className="th-col th-dept">CLIENT / DEPARTMENT</div>
                <div className="th-col th-status">STATUS</div>
                <div className="th-col th-active">LAST ACTIVE</div>
                <div className="th-col th-actions">ACTIONS</div>
              </div>

              {/* Table Body */}
              <div className="team-table__body">
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 10, color: '#64748B', fontSize: 13 }}>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Loading users...
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: '#B91C1C', fontSize: 13, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Failed to load users</div>
                    <div>{error}</div>
                  </div>
                ) : users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontSize: 13 }}>
                    No users found.
                  </div>
                ) : (
                  users.map((user) => {
                    const style = ROLE_STYLES[user.role] || ROLE_STYLES.customer;
                    return (
                      <div
                        key={user.id}
                        className="team-row"
                        style={{
                          '--row-bg': style.rowBg,
                          '--row-hover': style.hoverBg,
                          '--row-border': style.leftBorder,
                        }}
                      >
                        <div className="td-col td-name">{getDisplayName(user)}</div>

                        <div className="td-col td-email">{user.email}</div>

                        <div className="td-col td-role">
                          <RoleBadge role={user.role} />
                        </div>

                        <div className="td-col td-dept">
                          <span className={user.department ? "dept-assigned" : "dept-none"}>
                            {user.department || "No Department"}
                          </span>
                        </div>

                        <div className="td-col td-status">
                          <div className="status-badge">
                            <span className="status-dot" />
                            Active
                          </div>
                        </div>

                        <div className="td-col td-active">
                          {new Date(user.created_at).toLocaleString()}
                        </div>

                        <div className="td-col td-actions">
                          {isAdmin ? (
                            <>
                              <button className="action-btn btn-edit" onClick={() => setEditingUser(user)}>
                                <Edit2 size={14} strokeWidth={2} />
                                Edit
                              </button>
                              <button className="action-btn btn-block">
                                <Ban size={14} strokeWidth={2} />
                                Block
                              </button>
                              <button className="action-btn btn-delete" onClick={() => handleDelete(user)}>
                                <Trash2 size={14} strokeWidth={2} />
                                Delete
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#94A3B8' }}>View Only</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={() => { setIsCreateOpen(false); fetchUsers(); }}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => { setEditingUser(null); fetchUsers(); }}
        />
      )}
    </DashboardLayout>
  );
};

export default TeamDirectoryPage;
