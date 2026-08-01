import './SLAHeader.css';

/**
 * SLAHeader
 *
 * Displays the page-level title and subtitle for the SLA Policy Command section.
 *
 * Props:
 *  - title    {string}  Section heading
 *  - subtitle {string}  Short description below heading
 */
const SLAHeader = ({ title = 'SLA POLICY COMMAND', subtitle = 'Configure response and resolution thresholds for incoming support tiers.' }) => {
  return (
    <div className="sla-header">
      <h2 className="sla-header__title">{title}</h2>
      <p className="sla-header__subtitle">{subtitle}</p>
    </div>
  );
};

export default SLAHeader;
