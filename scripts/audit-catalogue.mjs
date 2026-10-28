// Read-only catalogue audit. Never writes anywhere.
// Usage: node scripts/audit-catalogue.mjs <catalog.json> [masters.json]
// Download both from Firebase Console > Storage > catalogue/data/catalog.json
// and catalogue/config/masters.json.
import fs from 'node:fs';
import { bootstrapMasters, normalizeMasters, productMasterValue } from '../src/services/catalogMasters.js';
import { isBoysOnlyBrand, normalizeCategory, normalizeColor, productTypesOf } from '../src/utils/productFilters.js';

const [catalogPath, mastersPath] = process.argv.slice(2);
if (!catalogPath) { console.error('Usage: node scripts/audit-catalogue.mjs <catalog.json> [masters.json]'); process.exit(1); }
const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const masters = mastersPath
  ? normalizeMasters(JSON.parse(fs.readFileSync(mastersPath, 'utf8')))
  : bootstrapMasters(products, [...new Set(products.map((p) => p.brand).filter(Boolean))]);

const live = products.filter((p) => p?.published === true && Array.isArray(p.images) && p.images.length);
console.log(`Products: ${products.length} total, ${live.length} visible on the public page\n`);

const view = (p) => ({
  category: normalizeCategory(p, masters),
  types: productTypesOf(p, masters),
  collection: productMasterValue(p, 'collections', masters),
  wear: productMasterValue(p, 'wearStyles', masters),
  brand: productMasterValue(p, 'brands', masters),
  color: normalizeColor(p),
});
const rows = live.map((p) => ({ p, v: view(p) }));

for (const [label, field] of [['Category', 'category'], ['Product type (a product can be in several)', 'types'], ['Collection', 'collection'], ['Wear style', 'wear'], ['Brand', 'brand'], ['Color', 'color']]) {
  const tally = new Map();
  rows.forEach(({ v }) => [].concat(v[field] || '(none)').forEach((value) => tally.set(value, (tally.get(value) || 0) + 1)));
  console.log(`${label}: ${[...tally].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}=${n}`).join(', ')}`);
}

const issues = [];
const groups = { boys: /\bboys?\b/, girls: /\bgirls?\b/, women: /\bwom[ae]ns?\b|\bladies\b/, men: /\bmens?\b/ };
const catGroup = (c) => { const k = String(c).toLowerCase(); return /girl/.test(k) ? 'girls' : /boy/.test(k) ? 'boys' : /wom/.test(k) ? 'women' : /^men/.test(k) ? 'men' : ''; };
for (const { p, v } of rows) {
  const id = `${p.styleCode || p.id} "${p.productName || ''}"`;
  const cg = catGroup(v.category);
  const named = String([p.productName, p.styleCode].join(' ')).toLowerCase();
  for (const [group, pattern] of Object.entries(groups)) {
    if (cg && group !== cg && pattern.test(named) && !groups[cg].test(named)) issues.push(`CATEGORY?  ${id}: filed under ${v.category} but name suggests ${group}`);
  }
  if (isBoysOnlyBrand(p) && String(p.category || '').toLowerCase() !== 'boys') issues.push(`CODEZ      ${id}: stored category "${p.category || ''}" - shown as Boys on the website; set it to Boys in Admin`);
  if (p.category && v.category.toLowerCase() !== String(p.category).trim().toLowerCase() && !isBoysOnlyBrand(p)) issues.push(`SPELLING   ${id}: category "${p.category}" is shown as ${v.category}`);
  if (!p.category) issues.push(`NO CATEGORY ${id}: category missing (shown as ${v.category})`);
  if (!p.productType) issues.push(`NO TYPE    ${id}: productType missing (types from name: ${v.types.join(' + ')})`);
  if (!p.color && !p.colour) issues.push(`NO COLOR   ${id}: color field missing (detected ${v.color || 'none'}) - will ${v.color ? 'match' : 'NOT match'} a color filter`);
  if (!p.wearStyle) issues.push(`NO WEAR    ${id}: wearStyle missing (defaulted ${v.wear})`);
  if (!p.collection) issues.push(`NO COLLECTION ${id}: collection missing (defaulted ${v.collection})`);
  const known = (key, value) => masters[key].some((o) => o.value.toLowerCase() === String(value).toLowerCase());
  for (const [key, value] of [['categories', v.category], ['collections', v.collection], ['wearStyles', v.wear], ['brands', v.brand]]) {
    if (value && !known(key, value)) issues.push(`NOT IN MASTERS ${id}: ${key} "${value}"`);
  }
}
console.log(`\n${issues.length} item(s) to review${issues.length ? ':' : '.'}`);
issues.forEach((line) => console.log(' - ' + line));
