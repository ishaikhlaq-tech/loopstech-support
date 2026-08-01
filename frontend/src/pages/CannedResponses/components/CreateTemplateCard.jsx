import TemplateForm from './TemplateForm';

const CreateTemplateCard = ({ onCreate, loading }) => {
  return (
    <div className="cr-card create-template-card">
      <h3 className="create-template-card__heading">CREATE TEMPLATE</h3>
      <TemplateForm onSubmit={onCreate} loading={loading} />
    </div>
  );
};

export default CreateTemplateCard;
