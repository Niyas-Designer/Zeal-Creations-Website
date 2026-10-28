import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { bootstrapMasters, MASTER_GROUPS, productMasterValue } from '../src/services/catalogMasters.js';

const products = Array.from({ length: 175 }, (_, index) => ({
  id: `existing-${index}`, styleCode: `Z-${index}`, sortOrder: index,
  productName: 'Existing polo t-shirt', brand: 'Existing Brand',
  category: index % 2 ? 'women' : 'men', productType: 'polo-t-shirts', collection: 'polo-t-shirts',
  published: index !== 174, trending: index === 0,
  images: [{ url: `https://example.test/${index}.webp`, storagePath: `catalogue/products/existing-${index}/image.webp` }],
}));
const productPath = 'catalogue/data/catalog.json';
const masterPath = 'catalogue/config/masters.json';
const brandPath = 'catalogue/config/brands.json';

async function harness(existing) {
  const files = existing?.files || new Map([[productPath, structuredClone(products)], [brandPath, ['Existing Brand']]]);
  const browserStorage = existing?.browserStorage || new Map();
  const reads = [], writes = [], deletes = [];
  const control = { fail: false, gate: null };
  const context = vm.createContext({
    Blob, TextDecoder, console,
    localStorage: {
      getItem: (key) => browserStorage.get(key) || null,
      setItem: (key, value) => browserStorage.set(key, value),
    },
  });
  const firebase = new vm.SyntheticModule(['ref', 'getBytes', 'uploadBytes', 'getDownloadURL', 'deleteObject'], function () {
    this.setExport('ref', (_, path) => path);
    this.setExport('getBytes', async (path) => {
      reads.push(path);
      if (control.gate) await control.gate;
      if (control.fail) throw new Error('Firebase unavailable');
      if (!files.has(path)) throw Object.assign(new Error('Missing'), { code: 'storage/object-not-found' });
      return new TextEncoder().encode(JSON.stringify(files.get(path)));
    });
    this.setExport('uploadBytes', async (path, blob) => { writes.push(path); files.set(path, JSON.parse(await blob.text())); });
    this.setExport('getDownloadURL', async () => 'https://example.test/image.webp');
    this.setExport('deleteObject', async (path) => { deletes.push(path); files.delete(path); });
  }, { context });
  const config = new vm.SyntheticModule(['storage'], function () {
    this.setExport('storage', { app: { options: { storageBucket: 'test-only' } } });
  }, { context });
  const masters = new vm.SourceTextModule(await readFile(new URL('../src/services/catalogMasters.js', import.meta.url), 'utf8'), { context });
  const storage = new vm.SourceTextModule(await readFile(new URL('../src/services/catalogStorage.js', import.meta.url), 'utf8'), { context });
  await storage.link((specifier) => {
    if (specifier === 'firebase/storage') return firebase;
    if (specifier === '../lib/firebase') return config;
    if (specifier === './catalogMasters.js') return masters;
    throw new Error(`Unexpected import: ${specifier}`);
  });
  await storage.evaluate();
  return { api: storage.namespace, files, browserStorage, reads, writes, deletes, control };
}

// These tests use isolated in-memory Firebase Storage; no real data is written.
test('legacy fields remain separate, and custom explicit values survive normalization', () => {
  const masters = bootstrapMasters(products, ['Existing Brand']);
  assert.deepEqual(Object.keys(masters), MASTER_GROUPS.map(({ key }) => key));
  for (const product of products) {
    assert.equal(productMasterValue(product, 'productTypes', masters), 'Polo T-Shirt');
    assert.equal(productMasterValue(product, 'collections', masters), 'Core');
    assert.equal(productMasterValue(product, 'wearStyles', masters), 'Casual Wear');
    assert.equal(productMasterValue(product, 'categories', masters), product.category === 'women' ? 'Women' : 'Men');
  }
  assert.equal(productMasterValue({ category: 'infants' }, 'categories', masters), 'Infants');
  for (const { key, field } of MASTER_GROUPS) {
    assert.equal(productMasterValue({ [field]: 'Custom value' }, key, masters), 'Custom value');
  }
});

test('all five masters support persistent create, rename and safe delete; 175 products/images remain unchanged', async () => {
  const h = await harness();
  const before = JSON.stringify(h.files.get(productPath));
  await h.api.loadCatalogue();
  for (const { key } of MASTER_GROUPS) {
    let data = await h.api.updateCatalogueMaster({ key, action: 'create', label: `New ${key}` });
    assert.ok(data.masters[key].some((option) => option.value === `New ${key}`));
    await assert.rejects(h.api.updateCatalogueMaster({ key, action: 'create', label: `NEW ${key}` }), /already exists/);
    data = await h.api.updateCatalogueMaster({ key, action: 'rename', value: `New ${key}`, label: `Renamed ${key}` });
    assert.equal(data.masters[key].find((option) => option.value === `New ${key}`).label, `Renamed ${key}`);
    // A new service/browser session reads the persisted Firebase config.
    const refreshed = await harness(h);
    const reloaded = await refreshed.api.loadCatalogue();
    assert.equal(reloaded.masters[key].find((option) => option.value === `New ${key}`).label, `Renamed ${key}`);
    data = await h.api.updateCatalogueMaster({ key, action: 'delete', value: `New ${key}` });
    assert.ok(!data.masters[key].some((option) => option.value === `New ${key}`));
    const usedValue = productMasterValue(products[0], key, data.masters);
    await assert.rejects(h.api.updateCatalogueMaster({ key, action: 'delete', value: usedValue }), /currently used by \d+ products/);
    data = await h.api.updateCatalogueMaster({ key, action: 'rename', value: usedValue, label: `Edited used ${key}` });
    assert.equal(productMasterValue(products[0], key, data.masters), usedValue);
  }
  assert.equal(JSON.stringify(h.files.get(productPath)), before);
  assert.equal(h.files.get(productPath).length, 175);
  assert.equal(h.files.get(productPath).flatMap((product) => product.images).length, 175);
  assert.ok(h.writes.every((path) => path === masterPath));
  assert.equal(h.deletes.length, 0);
  assert.deepEqual(Object.keys(h.files.get(masterPath)), MASTER_GROUPS.map(({ key }) => key));
});

test('delete protection includes unpublished products and inferred legacy fields', async () => {
  const h = await harness();
  h.files.set(productPath, [{ ...products[0], published: false }]);
  const data = await h.api.loadCatalogue();
  for (const { key } of MASTER_GROUPS) {
    await assert.rejects(h.api.updateCatalogueMaster({ key, action: 'delete', value: productMasterValue(products[0], key, data.masters) }), /used by 1 products/);
  }
  assert.equal(h.writes.length, 0);
});

test('cache-first reload, in-flight deduplication, TTL, stable references and background failures', async () => {
  const h = await harness();
  await Promise.all([h.api.loadCatalogue(), h.api.loadCatalogue(), h.api.loadCatalogue()]);
  assert.equal(h.reads.filter((path) => path === productPath).length, 1);
  const cached = h.api.getCachedCatalogue();
  const readsBefore = h.reads.length;
  await h.api.loadCatalogue({ maxAge: 60000 });
  assert.equal(h.reads.length, readsBefore);
  const unchanged = await h.api.loadCatalogue();
  assert.equal(unchanged.products, cached.products);
  assert.equal(unchanged.masters, cached.masters);
  const reload = await harness(h);
  assert.equal(reload.api.getCachedCatalogue().products.length, 175);
  assert.equal(reload.reads.length, 0);
  h.control.fail = true;
  await assert.rejects(h.api.loadCatalogue(), /Firebase unavailable/);
  assert.equal(h.api.getCachedCatalogue().products, cached.products);
  h.control.fail = false;
  h.files.get(productPath)[0].published = false;
  const updated = await h.api.loadCatalogue();
  assert.equal(updated.products[0].published, false);
  assert.notEqual(updated.products, cached.products);
});

test('concurrent master operations are serialized without losing values', async () => {
  const h = await harness();
  await Promise.all(['One', 'Two'].map((label) => h.api.updateCatalogueMaster({ key: 'brands', action: 'create', label })));
  const data = await h.api.loadCatalogue();
  assert.ok(data.masters.brands.some((option) => option.value === 'One'));
  assert.ok(data.masters.brands.some((option) => option.value === 'Two'));
});
