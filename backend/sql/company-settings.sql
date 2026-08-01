CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY,
  departments JSONB NOT NULL DEFAULT '[]'::jsonb,
  clients JSONB NOT NULL DEFAULT '[]'::jsonb,
  routing_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);