import DeleteButton from './DeleteButton';

const TemplateCard = ({ template, onDelete }) => {
  return (
    <div className="cr-card template-card">
      <div className="template-card__header">
        <div>
          <h3 className="template-card__title">{template.title}</h3>
          <p className="template-card__date">Created on {template.date}</p>
        </div>
        <DeleteButton onClick={() => onDelete(template.id)} />
      </div>
      <div className="template-card__body-box">
        <p className="template-card__body-text">{template.body}</p>
      </div>
    </div>
  );
};

export default TemplateCard;
