import { useEffect, useState } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import CreateTemplateCard from './components/CreateTemplateCard';
import TemplateList from './components/TemplateList';
import { apiRequest } from '../../api/client';
import toast from 'react-hot-toast';
import './CannedResponsesPage.css';

const CannedResponsesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/canned-responses');
      setTemplates(data.templates || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCreate = async ({ title, body }) => {
    setSaving(true);
    try {
      const data = await apiRequest('/canned-responses', {
        method: 'POST',
        body: JSON.stringify({ title, body }),
      });

      setTemplates((current) => [data.template, ...current]);
      toast.success('Template saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/canned-responses/${id}`, { method: 'DELETE' });
      setTemplates((current) => current.filter((template) => template.id !== id));
      toast.success('Template deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="Canned Responses">
      <div className="canned-responses-page">
        <div className="canned-responses-header">
          <h2 className="canned-responses-header__title">CANNED RESPONSES</h2>
          <p className="canned-responses-header__subtitle">Manage boilerplate templates for rapid support replies and triaging.</p>
        </div>

        <div className="canned-responses-layout">
          <div className="canned-responses-layout__left">
            <CreateTemplateCard onCreate={handleCreate} loading={saving} />
          </div>
          <div className="canned-responses-layout__right">
            <TemplateList templates={templates} loading={loading} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CannedResponsesPage;
