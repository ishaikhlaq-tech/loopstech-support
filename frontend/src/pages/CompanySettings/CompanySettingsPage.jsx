import { useEffect, useState } from 'react';
import { Search, ChevronDown, Trash2, Edit2, X, Loader2, RefreshCw } from 'lucide-react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './CompanySettingsPage.css';

const DEFAULT_SETTINGS = {
  departments: [],
  clients: [],
  routingRules: [],
  modules: [],
};

const uniqueStrings = (value, fallback = []) => {
  if (!Array.isArray(value)) return [...fallback];

  return [...new Set(
    value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
  )];
};

const normalizeRoutingRules = (value) => {
  if (!Array.isArray(value)) return [];

  const rules = value
    .map((rule, index) => ({
      id: String(rule?.id || `${Date.now()}-${index}`),
      owner: typeof rule?.owner === 'string' ? rule.owner.trim() : '',
      client: typeof rule?.client === 'string' && rule.client.trim() ? rule.client.trim() : 'All clients',
      module: typeof rule?.module === 'string' && rule.module.trim() ? rule.module.trim() : 'All modules',
    }))
    .filter(rule => rule.owner);

  return rules;
};

const normalizeModules = (value) => {
  if (!Array.isArray(value)) return [];

  const modules = value
    .map((module, index) => ({
      id: String(module?.id || `${Date.now()}-${index}`),
      name: typeof module?.name === 'string' ? module.name.trim() : '',
      subModules: uniqueStrings(module?.subModules),
    }))
    .filter(module => module.name);

  return modules;
};

const normalizeSettings = (value = {}) => ({
  departments: uniqueStrings(value.departments, DEFAULT_SETTINGS.departments),
  clients: uniqueStrings(value.clients, DEFAULT_SETTINGS.clients),
  routingRules: normalizeRoutingRules(value.routingRules ?? value.routing_rules),
  modules: normalizeModules(value.modules),
  updated_at: value.updated_at || null,
});

const formatSyncTime = (value) => {
  if (!value) return 'not synced yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return date.toLocaleString();
};

/* ─── Shared small components ─── */

function ItemRow({ label, onRename, onDelete }) {
  return (
    <div className="cs-item-row">
      <span className="cs-item-label">{label}</span>
      <div className="cs-item-actions">
        <button className="cs-btn cs-btn-rename" onClick={() => onRename(label)} type="button">
          <Edit2 size={13} strokeWidth={2} /> Rename
        </button>
        <button className="cs-btn cs-btn-delete" onClick={() => onDelete(label)} type="button">
          <Trash2 size={13} strokeWidth={2} /> Delete
        </button>
      </div>
    </div>
  );
}

function AddInputRow({ placeholder, onAdd, disabled }) {
  const [val, setVal] = useState('');
  return (
    <div className="cs-add-row">
      <input
        className="cs-input"
        placeholder={placeholder}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (disabled) return;
          if (e.key === 'Enter' && val.trim()) {
            onAdd(val.trim());
            setVal('');
          }
        }}
        disabled={disabled}
      />
      <button
        className="cs-btn-add"
        onClick={() => {
          if (disabled) return;
          if (val.trim()) {
            onAdd(val.trim());
            setVal('');
          }
        }}
        disabled={disabled}
        type="button"
      >Add</button>
    </div>
  );
}

function CustomSelect({ placeholder, options, value, onChange, disabled }) {
  return (
    <div className="cs-select-wrap">
      <select
        className="cs-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ color: value ? '#1C2333' : '#94A3B8' }}
        disabled={disabled}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="cs-select-arrow" size={18} strokeWidth={2.5} />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }) {
  return (
    <input
      className="cs-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

/* ─── Main Page ─── */
export default function CompanySettingsPage() {
  const { user } = useAuth();
  const isAdmin = (user?.app_role || user?.role) === 'admin';

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [modSearch, setModSearch] = useState('');
  const [modName, setModName] = useState('');
  const [modSubs, setModSubs] = useState('');
  const [selMod, setSelMod] = useState('');
  const [addSub, setAddSub] = useState('');
  const [routeOwner, setRouteOwner] = useState('');
  const [routeClient, setRouteClient] = useState('All clients');
  const [routeModule, setRouteModule] = useState('All modules');

  const fetchSettings = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/company-settings');
      const nextSettings = normalizeSettings(data.settings || data);
      setSettings(nextSettings);
      setLastSyncedAt(nextSettings.updated_at || new Date().toISOString());
    } catch (err) {
      setError(err.message);
      if (!silent) toast.error(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const interval = setInterval(() => {
      fetchSettings({ silent: true });
    }, 15000);

    const onFocus = () => fetchSettings({ silent: true });
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const persistSettings = async (nextSettings, successMessage) => {
    const normalized = normalizeSettings(nextSettings);
    setIsSaving(true);
    setSettings(normalized);

    try {
      const data = await apiRequest('/company-settings', {
        method: 'PUT',
        body: JSON.stringify(normalized),
      });

      const savedSettings = normalizeSettings(data.settings || data);
      setSettings(savedSettings);
      setLastSyncedAt(savedSettings.updated_at || new Date().toISOString());

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (err) {
      toast.error(err.message);
      await fetchSettings({ silent: true });
    } finally {
      setIsSaving(false);
    }
  };

  const updateDepartments = async (updater, successMessage) => {
    await persistSettings({ ...settings, departments: updater(settings.departments) }, successMessage);
  };

  const updateClients = async (updater, successMessage) => {
    await persistSettings({ ...settings, clients: updater(settings.clients) }, successMessage);
  };

  const updateRoutingRules = async (updater, successMessage) => {
    await persistSettings({ ...settings, routingRules: updater(settings.routingRules) }, successMessage);
  };

  const updateModules = async (updater, successMessage) => {
    await persistSettings({ ...settings, modules: updater(settings.modules) }, successMessage);
  };

  const addDept = async (value) => updateDepartments((current) => [...current, value], 'Department added');
  const delDept = async (value) => updateDepartments((current) => current.filter((item) => item !== value), 'Department deleted');
  const renDept = async (value) => {
    const nextValue = window.prompt('Rename to:', value);
    if (nextValue?.trim()) {
      await updateDepartments(
        (current) => current.map((item) => (item === value ? nextValue.trim() : item)),
        'Department renamed'
      );
    }
  };

  const addClient = async (value) => updateClients((current) => [...current, value], 'Client added');
  const delClient = async (value) => updateClients((current) => current.filter((item) => item !== value), 'Client deleted');
  const renClient = async (value) => {
    const nextValue = window.prompt('Rename to:', value);
    if (nextValue?.trim()) {
      await updateClients(
        (current) => current.map((item) => (item === value ? nextValue.trim() : item)),
        'Client renamed'
      );
    }
  };

  const saveRoute = async () => {
    if (!routeOwner) return;

    await updateRoutingRules(
      (current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          owner: routeOwner,
          client: routeClient || 'All clients',
          module: routeModule || 'All modules',
        },
      ],
      'Routing rule saved'
    );

    setRouteOwner('');
    setRouteClient('All clients');
    setRouteModule('All modules');
  };

  const delRoute = async (id) => updateRoutingRules((current) => current.filter((rule) => rule.id !== id), 'Routing rule deleted');

  const saveModule = async () => {
    if (!modName.trim()) return;

    const subModules = uniqueStrings(modSubs.split(','));
    await updateModules(
      (current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: modName.trim(),
          subModules,
        },
      ],
      'Module saved'
    );

    setModName('');
    setModSubs('');
  };

  const addSubModule = async () => {
    if (!selMod || !addSub.trim()) return;

    await updateModules(
      (current) => current.map((module) => (
        module.name === selMod
          ? { ...module, subModules: uniqueStrings([...module.subModules, addSub.trim()]) }
          : module
      )),
      'Sub-module added'
    );

    setAddSub('');
  };

  const removeSubTag = async (moduleId, subModule) => {
    await updateModules(
      (current) => current.map((module) => (
        module.id === moduleId
          ? { ...module, subModules: module.subModules.filter((item) => item !== subModule) }
          : module
      )),
      'Sub-module removed'
    );
  };

  const delModule = async (id) => updateModules((current) => current.filter((module) => module.id !== id), 'Module deleted');

  const renModule = async (id, name) => {
    const nextValue = window.prompt('Rename to:', name);
    if (nextValue?.trim()) {
      await updateModules(
        (current) => current.map((module) => (module.id === id ? { ...module, name: nextValue.trim() } : module)),
        'Module renamed'
      );
    }
  };

  const filteredMods = settings.modules.filter((module) =>
    module.name.toLowerCase().includes(modSearch.toLowerCase()) ||
    module.subModules.some((subModule) => subModule.toLowerCase().includes(modSearch.toLowerCase()))
  );

  const owners = [...new Set(settings.routingRules.map((rule) => rule.owner).filter(Boolean))];

  const summaryCards = [
    { label: 'Departments', value: settings.departments.length, hint: 'Backend-synced list' },
    { label: 'Clients', value: settings.clients.length, hint: 'Used in routing rules' },
    { label: 'Routing Rules', value: settings.routingRules.length, hint: 'Automatic assignment' },
    { label: 'Modules', value: settings.modules.length, hint: 'Visible in ticket forms' },
  ];

  return (
    <DashboardLayout title="Company Settings">
      <div className="cs-page">
        {/* Page header */}
        <div className="cs-page-header">
          <div>
            <h1 className="cs-page-title">Company Settings</h1>
            <p className="cs-page-sub">Manage departments, clients, routing rules, and ticket module catalogs from live backend data.</p>
          </div>

          <div className="cs-page-status">
            <span className={`cs-live-pill ${isSaving ? 'is-saving' : ''}`}>
              {isSaving ? <Loader2 size={12} className="cs-live-icon spin" /> : null}
              {isSaving ? 'Saving' : 'Live'}
            </span>
            <span className="cs-sync-text">Last synced {formatSyncTime(lastSyncedAt)}</span>
            <button className="cs-btn cs-btn-refresh" type="button" onClick={() => fetchSettings()} disabled={loading || isSaving}>
              <RefreshCw size={13} strokeWidth={2} />
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="cs-alert">{error}</div>}

        <div className="cs-summary-grid">
          {summaryCards.map((card) => (
            <div key={card.label} className="cs-summary-card">
              <span className="cs-summary-label">{card.label}</span>
              <span className="cs-summary-value">{card.value}</span>
              <span className="cs-summary-hint">{card.hint}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="cs-loading-panel">
            <Loader2 size={20} className="spin" />
            Loading company settings...
          </div>
        ) : (
          <>
            {/* 2-col grid */}
            <div className="cs-grid">
              {/* ── SECTION 1: Departments ── */}
              <div className="cs-card">
                <h2 className="cs-card-title">Departments</h2>
                <p className="cs-card-sub">Add, rename, or delete support departments for staff assignment.</p>
                <AddInputRow placeholder="e.g. Billing Support" onAdd={addDept} disabled={isSaving} />
                <div className="cs-list">
                  {settings.departments.map((department) => (
                    <ItemRow key={department} label={department} onRename={renDept} onDelete={delDept} />
                  ))}
                </div>
              </div>

              {/* ── SECTION 2: Clients ── */}
              <div className="cs-card">
                <h2 className="cs-card-title">Clients / Companies</h2>
                <p className="cs-card-sub">Add, rename, or delete clients for user assignment.</p>
                <AddInputRow placeholder="e.g. Acme Corp" onAdd={addClient} disabled={isSaving} />
                <div className="cs-list">
                  {settings.clients.map((client) => (
                    <ItemRow key={client} label={client} onRename={renClient} onDelete={delClient} />
                  ))}
                </div>
              </div>
            </div>

            <div className="cs-grid-row-stretch" style={{ marginTop: '28px' }}>
              {/* ── SECTION 3: Ticket Routing ── */}
              <div className="cs-card">
                <h2 className="cs-card-title">Ticket Routing</h2>
                <p className="cs-card-sub">Newest matching rule owns automatic assignment. All matching routed staff can still see the ticket.</p>
                <div className="cs-routing-form">
                  <TextInput
                    placeholder="Enter support owner..."
                    value={routeOwner}
                    onChange={setRouteOwner}
                    disabled={isSaving}
                  />
                  {owners.length > 0 && (
                    <div className="cs-helper-line">Existing owners: {owners.join(', ')}</div>
                  )}
                  <CustomSelect
                    placeholder="All clients"
                    options={settings.clients.length > 0 ? ['All clients', ...settings.clients] : ['All clients']}
                    value={routeClient}
                    onChange={setRouteClient}
                    disabled={isSaving}
                  />
                  <CustomSelect
                    placeholder="All modules"
                    options={settings.modules.length > 0 ? ['All modules', ...settings.modules.map((module) => module.name)] : ['All modules']}
                    value={routeModule}
                    onChange={setRouteModule}
                    disabled={isSaving}
                  />
                  <button className="cs-btn-save-full" onClick={saveRoute} disabled={isSaving || !routeOwner} type="button">Save Routing Rule</button>
                </div>
                <div className="cs-list">
                  {settings.routingRules.length === 0 && (
                    <div className="cs-empty-state">No routing rules yet.</div>
                  )}
                  {settings.routingRules.map((rule) => (
                    <div key={rule.id} className="cs-route-row">
                      <div className="cs-route-info">
                        <span className="cs-route-owner">{rule.owner}</span>
                        <span className="cs-route-detail">{rule.client} / {rule.module}</span>
                      </div>
                      <button className="cs-btn cs-btn-delete" onClick={() => delRoute(rule.id)} disabled={isSaving} type="button">
                        <Trash2 size={13} strokeWidth={2} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 4 Wrapper: Module Catalog + List ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div className="cs-card">
                  <h2 className="cs-card-title">Module Catalog</h2>
                  <p className="cs-card-sub">New modules and sub-modules appear in the ticket form dropdown.</p>

                  {/* Search */}
                  <div className="cs-search-wrap">
                    <Search size={16} className="cs-search-icon" />
                    <input
                      className="cs-search-input"
                      placeholder="Search modules or sub-modules..."
                      value={modSearch}
                      onChange={e => setModSearch(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>

                  {/* New module form */}
                  <div className="cs-module-form">
                    <label className="cs-field-label">MODULE NAME</label>
                    <input className="cs-input" placeholder="e.g. Payroll" value={modName} onChange={e => setModName(e.target.value)} disabled={isSaving} />

                    <label className="cs-field-label">SUB-MODULES</label>
                    <textarea
                      className="cs-textarea"
                      placeholder="Comma separated, e.g. Salary slip, Tax form, Bank update"
                      value={modSubs}
                      onChange={e => setModSubs(e.target.value)}
                      disabled={isSaving}
                    />

                    <button className="cs-btn-save-full" onClick={saveModule} disabled={isSaving || !modName.trim()} type="button">Save Module</button>
                  </div>

                  <div className="cs-divider" />

                  {/* Add sub-module to existing */}
                  <label className="cs-field-label">EXISTING MODULE</label>
                  <CustomSelect
                    placeholder="Select module..."
                    options={settings.modules.map((module) => module.name)}
                    value={selMod}
                    onChange={setSelMod}
                    disabled={isSaving}
                  />

                  <label className="cs-field-label" style={{ marginTop: 14 }}>ADD SUB-MODULE</label>
                  <input
                    className="cs-input"
                    placeholder="e.g. Approval delay"
                    value={addSub}
                    onChange={e => setAddSub(e.target.value)}
                    disabled={isSaving}
                  />
                  <button className="cs-btn-add-sub" onClick={addSubModule} disabled={isSaving || !selMod || !addSub.trim()} type="button">Add Sub-module</button>
                </div>

                {/* Module list */}
                <div className="cs-module-list" style={{ marginTop: 0 }}>
                  {filteredMods.length === 0 && (
                    <div className="cs-empty-state">No modules yet.</div>
                  )}
                  {filteredMods.map((module) => (
                    <div key={module.id} className="cs-module-card">
                      <div className="cs-module-top">
                        <div className="cs-module-meta">
                          <span className="cs-module-name">{module.name}</span>
                          <span className="cs-module-count">{module.subModules.length} sub-module{module.subModules.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="cs-item-actions">
                          <button className="cs-btn cs-btn-rename" onClick={() => renModule(module.id, module.name)} disabled={isSaving} type="button">
                            <Edit2 size={13} strokeWidth={2} /> Rename
                          </button>
                          <button className="cs-btn cs-btn-delete" onClick={() => delModule(module.id)} disabled={isSaving} type="button">
                            <Trash2 size={13} strokeWidth={2} /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="cs-module-tags">
                        {module.subModules.length === 0
                          ? <span className="cs-no-sub">No sub-modules yet.</span>
                          : module.subModules.map((subModule) => (
                              <span key={subModule} className="cs-tag">
                                {subModule}
                                <button className="cs-tag-del" onClick={() => removeSubTag(module.id, subModule)} disabled={isSaving} type="button">
                                  <X size={11} strokeWidth={2.5} />
                                </button>
                              </span>
                            ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
