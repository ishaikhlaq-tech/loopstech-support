import ThresholdInput from './ThresholdInput';
import './SLACard.css';

const SLACard = ({ tier, onDecrement, onIncrement, onSave, isReadOnly = false }) => {
  const { id, label, subtitle, dotColor, firstResponse, resolution } = tier;

  return (
    <div className="sla-card" style={isReadOnly ? { opacity: 0.85 } : {}}>
      {/* ── Tier badge ── */}
      <div className="sla-card__tier-header">
        <div className="sla-card__tier-row">
          <span className="sla-card__dot" style={{ backgroundColor: dotColor }} />
          <h3 className="sla-card__tier-name">{label}</h3>
        </div>
        <p className="sla-card__tier-subtitle">{subtitle}</p>
      </div>

      {/* ── Threshold steppers ── */}
      <div className="sla-card__inputs">
        <ThresholdInput
          label="FIRST RESPONSE (HRS)"
          value={firstResponse}
          onDecrement={() => onDecrement(id, 'firstResponse', -1)}
          onIncrement={() => onIncrement(id, 'firstResponse', 1)}
          isReadOnly={isReadOnly}
        />
        <ThresholdInput
          label="RESOLUTION (HRS)"
          value={resolution}
          onDecrement={() => onDecrement(id, 'resolution', -1)}
          onIncrement={() => onIncrement(id, 'resolution', 1)}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* ── Save button ── */}
      {!isReadOnly && (
        <button className="sla-card__save-btn" onClick={() => onSave(id)}>
          Update Thresholds
        </button>
      )}
    </div>
  );
};

export default SLACard;
