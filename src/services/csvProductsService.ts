import csvData from '../data/produits_assurance_final.csv?raw';

export interface CSVProduct {
  produit: string;
  compagnie: string;
  type_produit: string;
  assureurs_interroges?: string;
  champs_specifiques?: string;
  assurance_vie_epargne?: string;
}

export interface ProductsByCompany {
  compagnie: string;
  produits: CSVProduct[];
}

export interface ProductsByType {
  type: string;
  compagnies: string[];
}

let productsCache: CSVProduct[] | null = null;
let companiesCache: string[] | null = null;
let productsByCompanyCache: Map<string, CSVProduct[]> | null = null;
let productsByTypeCache: Map<string, string[]> | null = null;

function parseCSV(csv: string): CSVProduct[] {
  const lines = csv.trim().split('\n');
  const products: CSVProduct[] = [];

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const parts = line.split(';');
    if (parts.length >= 3) {
      products.push({
        produit: parts[0]?.trim() || '',
        compagnie: parts[1]?.trim() || '',
        type_produit: parts[2]?.trim() || '',
        assureurs_interroges: parts[3]?.trim() || '',
        champs_specifiques: parts[4]?.trim() || '',
        assurance_vie_epargne: parts[5]?.trim() || ''
      });
    }
  }

  return products;
}

export function getAllProducts(): CSVProduct[] {
  if (!productsCache) {
    productsCache = parseCSV(csvData);
  }
  return productsCache;
}

export function getAllCompanies(): string[] {
  if (!companiesCache) {
    const products = getAllProducts();
    const companiesSet = new Set<string>();

    products.forEach(p => {
      if (p.compagnie) {
        companiesSet.add(p.compagnie);
      }
    });

    companiesCache = Array.from(companiesSet).sort();
  }
  return companiesCache;
}

export function getProductsByCompany(companyName: string): CSVProduct[] {
  if (!productsByCompanyCache) {
    productsByCompanyCache = new Map();
    const products = getAllProducts();

    products.forEach(product => {
      const company = product.compagnie;
      if (!productsByCompanyCache!.has(company)) {
        productsByCompanyCache!.set(company, []);
      }
      productsByCompanyCache!.get(company)!.push(product);
    });
  }

  return productsByCompanyCache.get(companyName) || [];
}

export function getCompaniesOfferingProductType(productType: string, excludeCompany?: string): string[] {
  if (!productsByTypeCache) {
    productsByTypeCache = new Map();
    const products = getAllProducts();

    products.forEach(product => {
      const type = product.type_produit;
      if (!productsByTypeCache!.has(type)) {
        productsByTypeCache!.set(type, []);
      }
      const companies = productsByTypeCache!.get(type)!;
      if (!companies.includes(product.compagnie)) {
        companies.push(product.compagnie);
      }
    });
  }

  const companies = productsByTypeCache.get(productType) || [];

  if (excludeCompany) {
    return companies.filter(c => c !== excludeCompany);
  }

  return companies;
}

export function getProductType(companyName: string, productName: string): string | null {
  const products = getProductsByCompany(companyName);
  const product = products.find(p => p.produit === productName);
  return product?.type_produit || null;
}

export function normalizeProductType(type: string): string {
  const normalized = type.toLowerCase().trim();

  if (normalized === 'per') return 'PER';
  if (normalized === 'mutuelle') return 'Mutuelle';
  if (normalized === 'prevoyance') return 'Prevoyance';
  if (normalized === 'assurance vie') return 'Assurance vie';
  if (normalized === 'assurance emprunteur') return 'Assurance Emprunteur';
  if (normalized === 'iard') return 'IARD';
  if (normalized === 'obseque') return 'Obseque';
  if (normalized === 'girardin') return 'Girardin';
  if (normalized === 'scpi') return 'SCPI';

  return type;
}
