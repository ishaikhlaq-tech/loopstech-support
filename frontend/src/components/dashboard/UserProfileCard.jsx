import { useAuth } from '../../context/AuthContext';

const ROLE_STYLES = {
  admin:    'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]',
  agent:    'bg-[#E1EFFE] text-[#1E40AF] border border-[#A4CAFE]',
  customer: 'bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB]',
};

const UserProfileCard = ({ isCollapsed }) => {
  const { user } = useAuth();

  const displayName = user?.user_metadata?.name || user?.email || 'User';
  // Use app_role first - avoids Supabase's native 'authenticated' role overriding our custom role
  const role = user?.app_role || user?.role || 'customer';
  const roleLabel = role.toUpperCase();
  const badgeClass = ROLE_STYLES[role] || ROLE_STYLES.customer;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <div className={`border border-[#E2E8F0] rounded-[12px] flex items-center bg-[#FAFAFA] hover:bg-slate-50 transition-colors ${isCollapsed ? 'p-1 justify-center' : 'p-2.5'}`}>
      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-[#EAF5F3] flex items-center justify-center text-[12px] font-bold text-[#109F8D] shrink-0">
        {initials}
      </div>

      {/* User details (hidden when collapsed) */}
      {!isCollapsed && (
        <div className="flex flex-col ml-2.5 overflow-hidden justify-center gap-0.5">
          <span className="text-[13px] font-bold text-[#0F172A] leading-none truncate">{displayName}</span>
          <div className="flex items-center">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider leading-none ${badgeClass}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
