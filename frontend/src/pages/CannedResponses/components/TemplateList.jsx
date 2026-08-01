import TemplateCard from './TemplateCard';
const TemplateList = ({ templates, loading, onDelete }) => {
  const renderDate = (value) => {
    if (!value) return 'Unknown date';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString();
  };

  return (
    <div className="template-list">
      {loading ? (
        <div className="template-list__empty">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="template-list__empty">No canned responses yet.</div>
      ) : (
        templates.map((template) => (
        <TemplateCard
          key={template.id} 
          template={{
            ...template,
            date: renderDate(template.created_at),
          }}
          onDelete={onDelete}
        />
        ))
      )}
    </div>
  );
};

export default TemplateList;
