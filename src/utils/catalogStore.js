const STORAGE_KEY = 'zeal_catalog_products'

export function getCatalogProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getCatalogProductById(id) {
  return getCatalogProducts().find((product) => product.id === id)
}

export function saveCatalogProduct(product) {
  const products = getCatalogProducts()

  const newProduct = {
    ...product,
    id: product.id || `product-${Date.now()}`,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const existingIndex = products.findIndex(
    (item) => item.id === newProduct.id,
  )

  if (existingIndex >= 0) {
    products[existingIndex] = newProduct
  } else {
    products.push(newProduct)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))

  return newProduct
}

export function deleteCatalogProduct(id) {
  const products = getCatalogProducts().filter(
    (product) => product.id !== id,
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function sortTrendingFirst(products) {
  return [...products].sort((a, b) => {
    if (a.trending && !b.trending) return -1
    if (!a.trending && b.trending) return 1

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
}