import './ThresholdInput.css';

const ThresholdInput = ({ label, value, onDecrement, onIncrement, min = 1, isReadOnly = false }) => {
  return (
    <div className="threshold-input">
      <span className="threshold-input__label">{label}</span>
      <div className="threshold-input__control">
        <button
          className="threshold-input__btn"
          onClick={onDecrement}
          disabled={value <= min || isReadOnly}
          aria-label={`Decrease ${label}`}
          style={isReadOnly ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
        >
          −
        </button>
        <span className="threshold-input__value">{value}</span>
        <button
          className="threshold-input__btn"
          onClick={onIncrement}
          disabled={isReadOnly}
          aria-label={`Increase ${label}`}
          style={isReadOnly ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ThresholdInput;
