import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { bootstrapMasters, productMasterValue } from '../src/services/catalogMasters.js';
import { displayType, isBoysOnlyBrand, normalizeCategory, normalizeCategoryOptions, normalizeColor, normalizeProductType, normalizeProductTypeOptions, productTypesOf, typeRank, typeSection } from '../src/utils/productFilters.js';

const products = [
  { id: 'hoodie-black', productType: 'Hoodie', color: 'Black', category: 'men' },
  { id: 'hoodies-navy', productType: 'Hoodies', color: 'Navy', category: 'men', description: 'Also available in black and blue' },
  { id: 'polo-blue', productType: 'Polo T-Shirts', color: 'Blue', category: 'men' },
  { id: 'polo-black', productType: 'polo_t_shirt', colour: 'Black', category: 'women' },
  { id: 'tee-grey', productType: 'T-Shirts', color: 'Gray', category: 'men' },
  { id: 'tee-navy', productType: 't shirt', productName: 'Navy Blue cotton tee', category: 'women' },
  { id: 'tee-black', productType: 't-shirt', productName: 'Black cotton tee', category: 'men' },
].map((product, index) => ({ ...product, published: true, sortOrder: index, images: ['test.webp'], brand: 'Test', collection: 'Core', wearStyle: 'Casual Wear' }));
products.push({ ...products[0], id: 'unpublished-hoodie', published: false });
const masters = bootstrapMasters(products, ['Test']);
// Exercise the actual page item conversion, count calculation and checkbox predicate.
const page = fs.readFileSync(new URL('../src/components/ProductShopPage.jsx', import.meta.url), 'utf8');
const imageHelpers = page.slice(page.indexOf('function imageUrl('), page.indexOf('/* =========================================================\n   FIREBASE PRODUCTS'));
const itemConversion = page.slice(page.indexOf('function uploadedItems('), page.indexOf('/* =========================================================\n   ICONS'));
const options = page.slice(page.indexOf('  const counts = useMemo('), page.indexOf('  /* =======================================================\n     FILTERING'));
const predicate = page.slice(page.indexOf('  const visible ='), page.indexOf('  const toggle ='));
const colors = ['Black', 'White', 'Blue', 'Green', 'Navy Blue', 'Grey', 'Red', 'Brown'].map(value => ({ value }));
function gallery(selected = {}) {
  return vm.runInNewContext(`${imageHelpers}\n${itemConversion}\nconst all = uploadedItems(products, masters);\n${options}\n${predicate}\n({all, visible, masterOptions, colorOptions});`, {
    products, masters, productMasterValue, normalizeCategory, normalizeCategoryOptions, normalizeColor, normalizeProductType, normalizeProductTypeOptions, productTypesOf, displayType, typeRank, typeSection,
    approvedColors: colors, useMemo: fn => fn(), query: '', categories: [], brandSel: [], types: [], wearStyles: [], collectionsSel: [], colors: [], ...selected,
  });
}

test('obvious type aliases share one canonical value; custom master types remain intact', () => {
  for (const value of ['Hoodie', 'Hoodies', 'hoodie', 'hoodies', ' HOODIES ']) assert.equal(normalizeProductType({ productType: value }, masters), 'Hoodie');
  for (const [raw, expected] of [['Polo T-Shirts', 'Polo'], ['polo_t_shirts', 'Polo'], ['t shirts', 'T-Shirt'], ['TShirts', 'T-Shirt'], ['Track Pants', 'Pants'], ['Joggers', 'Pants']]) {
    assert.equal(normalizeProductType({ productType: raw }, masters), expected);
  }
  const custom = { ...masters, productTypes: [...masters.productTypes, { value: 'custom-type-id', label: 'Custom Garment' }] };
  assert.equal(normalizeProductType({ productType: 'custom-type-id' }, custom), 'custom-type-id');
  assert.equal(normalizeProductTypeOptions(custom.productTypes, custom).find(option => option.value === 'custom-type-id').label, 'Custom Garment');
});

test('explicit colors take precedence over prose; inferred colors match whole words and specific colors first', () => {
  for (const [color, expected] of [['Black', 'Black'], ['Navy', 'Navy Blue'], ['NAVY BLUE', 'Navy Blue'], ['Blue', 'Blue'], ['Off-White', 'White'], ['Gray', 'Grey'], ['Olive', 'Green'], ['Maroon', 'Red']]) {
    assert.equal(normalizeColor({ color, description: 'Black Navy Blue white red' }), expected);
  }
  assert.equal(normalizeColor({ productName: 'Navy-Blue Hoodie' }), 'Navy Blue');
  assert.equal(normalizeColor({ productName: 'Black Hoodie', description: 'Also available in navy blue' }), 'Black');
  // Descriptions are never a color source: they would file products under unrelated colors.
  assert.equal(normalizeColor({ description: 'Navy Blue / Black / Blue' }), '');
  assert.equal(normalizeColor({ productName: 'Cotton hoodie', collection: 'Black Friday', description: 'Also in blue' }), '');
  assert.equal(normalizeColor({ productName: 'Embroidered cotton standard hoodie' }), '');
  assert.equal(normalizeColor({ productName: 'Blackberry top' }), '');
  assert.equal(normalizeColor({ colour: 'Navy', description: 'Black' }), 'Navy Blue');
});

test('every displayed option count equals the actual checkbox result, including aliases and unpublished exclusion', () => {
  const before = JSON.stringify(products);
  const base = gallery();
  const fields = { categories: 'categories', productTypes: 'types', collections: 'collectionsSel', wearStyles: 'wearStyles', brands: 'brandSel' };
  for (const [key, selection] of Object.entries(fields)) {
    for (const option of base.masterOptions[key]) {
      assert.equal(gallery({ [selection]: [option.value] }).visible.length, option.count, `${key}: ${option.value}`);
    }
  }
  for (const option of base.colorOptions) {
    assert.equal(gallery({ colors: [option.value] }).visible.length, option.count, `Color: ${option.value}`);
  }
  const hoodie = base.masterOptions.productTypes.find(option => option.value === 'Hoodie');
  assert.equal(hoodie.count, 2);
  assert.deepEqual(Array.from(gallery({ types: ['Hoodie'] }).visible, item => item.id), ['hoodie-black', 'hoodies-navy']);
  assert.equal(base.masterOptions.productTypes.filter(option => option.value === 'Hoodie').length, 1);
  for (const type of ['Polo', 'T-Shirt']) assert.ok(gallery({ types: [type] }).visible.length > 0);
  assert.equal(JSON.stringify(products), before);
});

test('Black, Navy Blue and Blue stay isolated; AND/OR and search combinations stay unchanged', () => {
  const expected = { Black: ['hoodie-black', 'polo-black', 'tee-black'], 'Navy Blue': ['hoodies-navy', 'tee-navy'], Blue: ['polo-blue'] };
  for (const [color, ids] of Object.entries(expected)) {
    const selected = gallery({ colors: [color] });
    assert.deepEqual(Array.from(selected.visible, item => item.id), ids);
    assert.ok(selected.visible.every(item => item.color === color));
  }
  assert.deepEqual(Array.from(gallery({ categories: ['Men'], types: ['Hoodie'], colors: ['Black'] }).visible, item => item.id), ['hoodie-black']);
  assert.equal(gallery({ types: ['Hoodie'], colors: ['Black', 'Navy Blue'] }).visible.length, 2);
  assert.equal(gallery({ types: ['Hoodie', 'Polo'] }).visible.length, 4);
  assert.equal(gallery({ query: 'hoodie', types: ['Hoodie'] }).visible.length, 2);
});

test('category values map to exactly one group: Women never lands in Men, Boys never in Girls', () => {
  const expected = [['Men', 'Men'], ['men', 'Men'], ['Mens', 'Men'], ['Womens', 'Women'], ["Women's", 'Women'], ['women', 'Women'], ['Boys', 'Boys'], ['boy', 'Boys'], ['Girls', 'Girls'], ['girl', 'Girls'], ['Baby Girl', 'Baby Girl'], ['Baby Boy', 'Baby Boy'], ['Infant Boys', 'Infant Boys'], ['Infant Girls', 'Infant Girls'], ['Unisex', 'Unisex']];
  for (const [raw, category] of expected) {
    assert.equal(productMasterValue({ category: raw }, 'categories', { categories: [] }), category, raw);
  }
});

test('garment type is inferred from name/type only, never from description or "short sleeve"', () => {
  const infer = (product) => productMasterValue(product, 'productTypes', { productTypes: [] });
  assert.equal(infer({ productName: 'Short Sleeve Polo' }), 'Polo T-Shirt');
  assert.equal(infer({ productName: 'Cotton T-Shirt', description: 'Pairs with joggers, a hoodie and shorts' }), 'T-Shirt');
  assert.equal(infer({ productName: 'Steel grey shirt' }), 'Shirt');
  assert.equal(infer({ productName: 'Printed crop top' }), 'Top');
  assert.equal(infer({ productName: 'Zip Hooded Sweatshirt' }), 'Zipper Hoodie');
  assert.equal(infer({ productName: 'Hoodie and Jogger Set' }), 'Hoodie & Track Pant Set');
});

test('values missing from saved masters still get a working checkbox, so no product is unreachable', () => {
  const orphan = [{ id: 'kids-1', published: true, images: ['a.webp'], category: 'Boys', productType: 'Hoodie', brand: 'Zeal', color: 'Black', wearStyle: 'Casual Wear', collection: 'Winter' }];
  const bare = { categories: [], productTypes: [], collections: [], wearStyles: [], brands: [] };
  const view = gallery({ products: orphan, masters: bare });
  assert.equal(JSON.stringify(view.masterOptions.categories.map(o => [o.value, o.count])), JSON.stringify([['Boys', 1]]));
  assert.equal(gallery({ products: orphan, masters: bare, categories: ['Boys'] }).visible.length, 1);
  assert.equal(gallery({ products: orphan, masters: bare, categories: ['Girls'] }).visible.length, 0);
});

test('product types collapse into broad groups: every variation lands in exactly one', () => {
  const group = (productType) => normalizeProductType({ productType }, { productTypes: [] });
  const expected = {
    'T-Shirt': ['T-Shirt', 'T-Shirts', 'Full Sleeve T-Shirt', 'Tank Top', 'Tee'],
    Polo: ['Polo', 'Polo T-Shirt', 'Textured Polo', 'Polo Shirt', 'Striped Polo T-Shirt', 'Pique Polo'],
    Shirt: ['Shirt', 'Shirts', 'Casual Shirt', 'Oxford Shirt'],
    Hoodie: ['Hoodie', 'Hoodies', 'Zipper Hoodie', 'Zip Hoodie', 'Hooded Jacket'],
    Sweatshirt: ['Sweatshirt', 'Sweatshirts', 'High Neck Sweatshirt', 'High-Neck', 'High Neck Pullover', 'Crew Neck Sweatshirt'],
    Pants: ['Track Pant', 'Track Pants', 'Jogger', 'Joggers', 'Trouser', 'Cargo Pant', 'Pants', 'Legging'],
    Shorts: ['Shorts', 'Short', 'Cargo Shorts', 'Bermuda Shorts'],
    Sets: ['Co-ord Set', 'T-Shirt & Track Pant Set', '2 Piece Set', 'Kids Sets'],
  };
  for (const [expectedGroup, values] of Object.entries(expected)) {
    for (const value of values) assert.equal(group(value), expectedGroup, value);
  }
  assert.equal(group('High Neck T-Shirt'), 'T-Shirt');
  assert.equal(group('Short Sleeve T-Shirt'), 'T-Shirt');
  assert.equal(group('Short Sleeve Polo'), 'Polo');
});

test('the Product Type filter shows only the broad groups, in a fixed order, with no duplicates', () => {
  const raw = ['Track Pants', 'Polo T-Shirts', 'Hoodies', 'Zipper Hoodies', 'Joggers', 'Textured Polo', 'T-Shirts', 'Shorts', 'Shirts', 'Sweatshirts', 'High Neck Sweatshirt']
    .map((value) => ({ value, label: value }));
  const options = normalizeProductTypeOptions(raw);
  assert.equal(JSON.stringify(options.map((o) => o.value)), JSON.stringify(['T-Shirt', 'Polo', 'Shirt', 'Hoodie', 'Sweatshirt', 'Pants', 'Shorts']));
});

test('every product of a type appears when its group is selected: Hoodie includes zipper hoodies', () => {
  const list = [
    { id: 'a', productType: 'Hoodie' }, { id: 'b', productType: 'Zipper Hoodie' }, { id: 'c', productType: 'Hoodies' },
    { id: 'd', productType: 'Textured Polo' }, { id: 'e', productType: 'Polo T-Shirt' }, { id: 'f', productType: 'Joggers' }, { id: 'g', productType: 'Track Pants' },
    { id: 'h', productType: 'High Neck Sweatshirt' }, { id: 'i', productType: 'Cargo Shorts' }, { id: 'j', productType: 'Shorts' },
  ].map((p, i) => ({ ...p, published: true, sortOrder: i, images: ['x.webp'], category: 'Men', brand: 'Test', color: 'Black', collection: 'Core', wearStyle: 'Casual Wear' }));
  const ids = (types) => Array.from(gallery({ products: list, masters: bootstrapMasters(list, ['Test']), types }).visible, (i) => i.id).sort().join('');
  assert.equal(ids(['Hoodie']), 'abc');
  assert.equal(ids(['Polo']), 'de');
  assert.equal(ids(['Pants']), 'fg');
  assert.equal(ids(['Sweatshirt']), 'h');
  assert.equal(ids(['Shorts']), 'ij');
});

test('Men, Women, Boys and Girls are exclusive; spelling variants share one category', () => {
  const make = (id, category, extra = {}) => ({ id, category, published: true, images: ['x.webp'], productType: 'T-Shirt', brand: 'Test', color: 'Black', collection: 'Core', wearStyle: 'Casual Wear', ...extra });
  const list = [make('m1', 'Men'), make('m2', 'Mens'), make('w1', 'Women'), make('w2', 'Womens'), make('w3', "Women's"), make('b1', 'Boys'), make('b2', 'boy'), make('g1', 'Girls'), make('g2', 'GIRL'), make('ib', 'Infant Boys'), make('u', 'Unisex')];
  const m = bootstrapMasters(list, ['Test']);
  const ids = (categories) => Array.from(gallery({ products: list, masters: m, categories }).visible, (i) => i.id).sort().join(',');
  assert.equal(ids(['Men']), 'm1,m2');
  assert.equal(ids(['Women']), 'w1,w2,w3');
  assert.equal(ids(['Boys']), 'b1,b2');
  assert.equal(ids(['Girls']), 'g1,g2');
  assert.equal(ids(['Infant Boys']), 'ib');
  const view = gallery({ products: list, masters: m });
  assert.equal(JSON.stringify(view.masterOptions.categories.map((o) => o.value)), JSON.stringify(['Men', 'Women', 'Boys', 'Girls', 'Infant Boys', 'Infants', 'Unisex']));
  for (const option of view.masterOptions.categories) assert.equal(gallery({ products: list, masters: m, categories: [option.value] }).visible.length, option.count, option.value);
});

test('CodeZ is a boys-only brand: always Boys, never Girls, whatever the stored category', () => {
  for (const brand of ['CodeZ', 'Codez', 'CODEZ', 'Code Z', 'Code-Z']) assert.equal(isBoysOnlyBrand({ brand }), true, brand);
  assert.equal(isBoysOnlyBrand({ brand: 'Ardeur' }), false);
  assert.equal(isBoysOnlyBrand({ brand: 'Roadster', legacySourceFolder: 'Codez' }), true);
  const stored = ['Girls', 'Women', 'Unisex', 'Men', 'Boys', '', undefined];
  const list = stored.map((category, i) => ({ id: `cz${i}`, brand: 'CodeZ', category, published: true, images: ['x.webp'], productType: 'T-Shirt', color: 'Black', collection: 'Core', wearStyle: 'Casual Wear' }));
  list.push({ id: 'girl-other', brand: 'Other', category: 'Girls', published: true, images: ['x.webp'], productType: 'Dress', color: 'Red', collection: 'Core', wearStyle: 'Casual Wear' });
  const m = bootstrapMasters(list, ['CodeZ', 'Other']);
  assert.equal(gallery({ products: list, masters: m, categories: ['Boys'] }).visible.length, stored.length);
  assert.equal(JSON.stringify(Array.from(gallery({ products: list, masters: m, categories: ['Girls'] }).visible, (i) => i.id)), JSON.stringify(['girl-other']));
  assert.equal(gallery({ products: list, masters: m, categories: ['Men'] }).visible.length, 0);
  assert.equal(gallery({ products: list, masters: m, brandSel: ['CodeZ'], categories: ['Girls'] }).visible.length, 0);
  assert.equal(normalizeCategory({ brand: 'CodeZ', category: 'Girls' }, m), 'Boys');
});

/* ---------- Real catalogue snapshot (175 products) ---------- */
const snapshot = fs.readFileSync(new URL('./fixtures/catalogue-snapshot.txt', import.meta.url), 'utf8')
  .split('\n').filter((line) => line && !line.startsWith('#'))
  .map((line, index) => {
    const [brand, category, productType, ...name] = line.split('|');
    return { id: `snap-${index}`, brand, category, productType, collection: productType, productName: name.join('|'), published: true, sortOrder: index, images: ['x.webp'] };
  });
const snapMasters = bootstrapMasters(snapshot, ['Codez', 'Ardeur', 'Fervoro', 'Revisited', 'HRX', 'Bag Mafia & Wedding Cake']);
const snap = (selected = {}) => gallery({ products: snapshot, masters: snapMasters, ...selected });
const names = (view) => Array.from(view.visible, (item) => item.productName);

test('snapshot: the file really holds the 175 live products', () => {
  assert.equal(snapshot.length, 175);
  assert.equal(snap().visible.length, 175);
});

test('snapshot: Hoodie shows every hoodie product, including hoodie sets stored as kids-sets/infant-sets', () => {
  const expected = snapshot.filter((p) => /hood/i.test(p.productName)).map((p) => p.productName).sort();
  assert.equal(expected.length, 8);
  assert.equal(JSON.stringify(names(snap({ types: ['Hoodie'] })).sort()), JSON.stringify(expected));
  const hoodieOption = snap().masterOptions.productTypes.find((o) => o.value === 'Hoodie');
  assert.equal(hoodieOption.count, 8);
});

test('snapshot: both CodeZ hoodies appear under Hoodie, only under Boys, never under Girls/Women/Men', () => {
  const codezHoodies = ['Boys Navy Colourblock Hoodie and Jogger Set', 'Boys Navy Graphic Pullover Hoodie'];
  assert.equal(JSON.stringify(names(snap({ types: ['Hoodie'], brandSel: ['Codez'] })).sort()), JSON.stringify(codezHoodies));
  assert.equal(JSON.stringify(names(snap({ types: ['Hoodie'], categories: ['Boys'] })).sort()), JSON.stringify(codezHoodies));
  for (const category of ['Girls', 'Women', 'Men', 'Infants']) {
    assert.equal(snap({ brandSel: ['Codez'], categories: [category] }).visible.length, 0, category);
  }
  assert.equal(snap({ brandSel: ['Codez'], categories: ['Boys'] }).visible.length, 67);
  assert.equal(snap({ categories: ['Girls'] }).visible.length, 0);
});

test('snapshot: every type option count equals the products shown, alone and with Men/Women/Boys selected', () => {
  for (const categories of [[], ['Men'], ['Women'], ['Boys'], ['Infants']]) {
    const options = snap({ categories }).masterOptions.productTypes;
    assert.ok(options.length > 0);
    for (const option of options) {
      assert.equal(snap({ categories, types: [option.value] }).visible.length, option.count, `${categories} / ${option.value}`);
    }
  }
});

test('snapshot: Product Type list only offers types that exist for the chosen category', () => {
  const typesFor = (categories) => snap({ categories }).masterOptions.productTypes.map((o) => o.value).sort().join(',');
  assert.equal(typesFor(['Men']), 'Pants,Polo,Sets,T-Shirt');
  assert.equal(typesFor(['Women']), 'Jacket,Jumpsuit,Pants,Sets,Shirt,Sweatshirt,T-Shirt,Top');
  assert.equal(typesFor(['Boys']), 'Hoodie,Pants,Polo,Sets,Shorts,Sweatshirt,T-Shirt');
  assert.equal(typesFor([]), 'Hoodie,Jacket,Jumpsuit,Pants,Polo,Sets,Shirt,Shorts,Sweatshirt,T-Shirt,Top');
  const sections = snap().masterOptions.productTypes.map((o) => o.section);
  assert.equal(JSON.stringify([...new Set(sections)]), JSON.stringify(['Top', 'Bottom', 'Sets']));
});

test('snapshot: product types follow the garments in the name, so each type shows all its valid variations', () => {
  const where = (type) => names(snap({ types: [type] }));
  assert.equal(where('Polo').length, 28); // 22 polo products + 6 polo-and-shorts sets
  assert.ok(where('Polo').includes('Boys Maroon Colourblock Polo T-Shirt and Shorts Set'));
  assert.ok(where('Shorts').includes('Infant Colour-Block Half-Zip Hoodie and Shorts Set'));
  assert.ok(where('Pants').includes("Men's Acid-Wash Raw-Seam Jeans"));
  assert.ok(where('Pants').includes('Boys Navy Athletic Graphic T-Shirt and Track Pants Set'));
  assert.ok(where('Sweatshirt').includes('Black Quarter-Zip Sweatshirt and Wide-Leg Pants Co-ord Set'));
  assert.ok(!where('Sweatshirt').includes('Boys Navy Graphic Pullover Hoodie'));
  assert.ok(!where('T-Shirt').includes('Boys Teal Graphic Polo T-Shirt'));
  for (const product of snapshot) assert.ok(snap().all.find((item) => item.productName === product.productName).productTypes.length > 0, product.productName);
});
