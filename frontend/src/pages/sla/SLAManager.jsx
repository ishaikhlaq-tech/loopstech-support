import DashboardLayout from '@components/layout/DashboardLayout';
import SLAHeader from '@components/sla/SLAHeader';
import SLACard from '@components/sla/SLACard';
import useSLA from '../../hooks/useSLA';
import { useAuth } from '../../context/AuthContext';
import './SLAManager.css';

const SLAManager = () => {
  const { tiers, loading, updateField, saveTier } = useSLA();
  const { user } = useAuth();
  const isAdmin = (user?.app_role || user?.role) === 'admin';

  return (
    <DashboardLayout title="SLA Management">
      <div className="sla-manager">
        <SLAHeader />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            Loading policies...
          </div>
        ) : (
          <div className="sla-manager__grid">
            {tiers.map((tier) => (
            <SLACard
              key={tier.id}
              tier={tier}
              onDecrement={isAdmin ? updateField : () => {}}
              onIncrement={isAdmin ? updateField : () => {}}
              onSave={isAdmin ? saveTier : () => {}}
              isReadOnly={!isAdmin}
            />
          ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SLAManager;
