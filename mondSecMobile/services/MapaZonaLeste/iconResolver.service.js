import * as IconServiceModule from '../IconService';
const DEFAULT_ICON = require('../../assets/icones/default.png');

export function resolveIcon(key) {
  const svc = IconServiceModule.default || IconServiceModule;
  if (!svc) return DEFAULT_ICON;
  if (!key) return svc.default || DEFAULT_ICON;

  const t = String(key).trim();
  return svc[t] || svc[t.toLowerCase()] || svc.default || DEFAULT_ICON;
}
