import { useState } from 'react';

const TemplateForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || loading) {
      return;
    }

    await onSubmit?.({ title: title.trim(), body: body.trim() });
    setTitle('');
    setBody('');
  };

  return (
    <form className="template-form" onSubmit={handleSubmit}>
      <div className="template-form__group">
        <label className="template-form__label">TEMPLATE TITLE</label>
        <input 
          className="template-form__input"
          type="text" 
          placeholder="e.g. Server Restored"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="template-form__group">
        <label className="template-form__label">RESPONSE BODY</label>
        <textarea 
          className="template-form__textarea"
          placeholder="Write the reply message template..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button type="submit" className="template-form__submit">
        {loading ? 'Saving...' : 'Save Template'}
      </button>
    </form>
  );
};

export default TemplateForm;
