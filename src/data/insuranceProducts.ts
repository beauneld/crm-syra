export interface ProductConfig {
  name: string;
  remuneration: string;
  fields: ProductField[];
  comparativeProposals: string[];
}

export interface ProductField {
  type: 'versement_initial' | 'mma_elite' | 'frais_versement' | 'vp_optionnel' | 'frais_a_definir' | 'date_effet_supplementaire' | 'versement_programme' | 'frais_chacun';
  label: string;
  required?: boolean;
  note?: string;
}

export interface CompanyConfig {
  name: string;
  products: ProductConfig[];
}

export const INSURANCE_COMPANIES: CompanyConfig[] = [
  {
    name: 'NEOLIANE',
    products: [
      {
        name: 'Plénitude',
        remuneration: '40/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife', 'Alptis']
      },
      {
        name: 'Soutien Hospi',
        remuneration: '40/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife', 'Alptis']
      },
      {
        name: 'Tempo Décès',
        remuneration: '—',
        fields: [],
        comparativeProposals: ['SwissLife Prévoyance', 'April Prévoyance', 'Entoria']
      },
      {
        name: 'Tempo Succès',
        remuneration: '—',
        fields: [],
        comparativeProposals: ['SwissLife Prévoyance', 'April Prévoyance', 'Entoria']
      },
      {
        name: 'Alto Santé',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife']
      },
      {
        name: 'Dynamique',
        remuneration: 'NSP',
        fields: [],
        comparativeProposals: []
      },
      {
        name: 'Hospi Zen',
        remuneration: '70/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife']
      },
      {
        name: 'Hospi Santé',
        remuneration: 'Linéaire',
        fields: [],
        comparativeProposals: ['April', 'SwissLife']
      },
      {
        name: 'Optima',
        remuneration: '40/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife']
      },
      {
        name: 'Obsèques',
        remuneration: '70/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife']
      },
      {
        name: 'Juridique',
        remuneration: 'Linéaire',
        fields: [],
        comparativeProposals: []
      }
    ]
  },
  {
    name: 'ALPTIS (Select Pro)',
    products: [
      {
        name: 'Select Pro 30/10',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['SwissLife', 'Entoria']
      },
      {
        name: 'Select Pro 40/10',
        remuneration: '40/10',
        fields: [],
        comparativeProposals: ['SwissLife', 'Entoria']
      },
      {
        name: 'Select Pro Linéaire',
        remuneration: 'Linéaire',
        fields: [],
        comparativeProposals: ['SwissLife', 'Entoria']
      }
    ]
  },
  {
    name: 'MMA',
    products: [
      {
        name: 'Signature Actifs',
        remuneration: 'Versement initial / MMA Elite ou non / Frais de versement / VP optionnel',
        fields: [
          { type: 'versement_initial', label: 'Versement initial (€)', required: false },
          { type: 'mma_elite', label: 'MMA Elite', required: false },
          { type: 'frais_versement', label: 'Frais de versement (%)', required: false },
          { type: 'vp_optionnel', label: 'VP optionnel', required: false }
        ],
        comparativeProposals: ['Generali Platinium', 'Omega']
      },
      {
        name: 'Signature PER',
        remuneration: 'Versement initial (obligatoire sauf dérogation) / Frais de versement / VP',
        fields: [
          { type: 'versement_initial', label: 'Versement initial (€)', required: true, note: 'Obligatoire sauf dérogation' },
          { type: 'frais_versement', label: 'Frais de versement (%)', required: false },
          { type: 'vp_optionnel', label: 'VP', required: false }
        ],
        comparativeProposals: ['Generali PER', 'SwissLife PER']
      }
    ]
  },
  {
    name: 'SWISSLIFE',
    products: [
      {
        name: 'Mutuelle',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['April', 'Neoliane', 'Alptis']
      },
      {
        name: 'Prévoyance',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['Neoliane', 'Alptis', 'Entoria']
      },
      {
        name: 'PER',
        remuneration: 'Versement initial + programmé + frais sur chacun',
        fields: [
          { type: 'versement_initial', label: 'Versement initial (€)', required: false },
          { type: 'versement_programme', label: 'Versement programmé (€)', required: false },
          { type: 'frais_chacun', label: 'Frais sur chacun (%)', required: false }
        ],
        comparativeProposals: ['Generali PER', 'MMA PER']
      }
    ]
  },
  {
    name: 'ENTORIA',
    products: [
      {
        name: 'Mutuelle',
        remuneration: '20/10 ou 30/10',
        fields: [],
        comparativeProposals: ['Neoliane', 'April']
      },
      {
        name: 'Collective',
        remuneration: 'Linéaire (frais à définir)',
        fields: [
          { type: 'frais_a_definir', label: 'Frais à définir', required: false }
        ],
        comparativeProposals: ['Alptis', 'SwissLife']
      },
      {
        name: 'Décennale',
        remuneration: 'Linéaire (frais à définir)',
        fields: [
          { type: 'frais_a_definir', label: 'Frais à définir', required: false }
        ],
        comparativeProposals: ['Alptis', 'SwissLife']
      }
    ]
  },
  {
    name: 'GENERALI',
    products: [
      {
        name: 'Epargne Platinium',
        remuneration: 'VP',
        fields: [
          { type: 'vp_optionnel', label: 'VP', required: false }
        ],
        comparativeProposals: ['MMA Actifs', 'Omega']
      },
      {
        name: 'Prévoyance du Pro',
        remuneration: 'VP',
        fields: [
          { type: 'vp_optionnel', label: 'VP', required: false }
        ],
        comparativeProposals: ['SwissLife', 'Neoliane']
      },
      {
        name: 'PER Generali',
        remuneration: "VP + date d'effet + frais de versement",
        fields: [
          { type: 'vp_optionnel', label: 'VP', required: false },
          { type: 'date_effet_supplementaire', label: "Date d'effet", required: false },
          { type: 'frais_versement', label: 'Frais de versement (%)', required: false }
        ],
        comparativeProposals: ['SwissLife PER', 'MMA PER']
      }
    ]
  },
  {
    name: 'APRIL',
    products: [
      {
        name: 'Accident',
        remuneration: '70/10',
        fields: [],
        comparativeProposals: []
      },
      {
        name: 'Emprunteur',
        remuneration: 'Frais de dossier',
        fields: [
          { type: 'frais_a_definir', label: 'Frais de dossier (€)', required: false }
        ],
        comparativeProposals: ['Zenioo', 'Neoliane']
      },
      {
        name: 'Mutuelle (individuelle)',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['SwissLife', 'Neoliane', 'UNIM']
      },
      {
        name: 'Mutuelle Collective',
        remuneration: 'Linéaire (frais à déterminer)',
        fields: [
          { type: 'frais_a_definir', label: 'Frais à déterminer', required: false }
        ],
        comparativeProposals: ['SwissLife', 'Neoliane']
      },
      {
        name: 'Prévoyance 30/10',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['SwissLife', 'Neoliane', 'Alptis']
      },
      {
        name: 'Prévoyance 40/10',
        remuneration: '40/10',
        fields: [],
        comparativeProposals: ['SwissLife', 'Neoliane', 'Alptis']
      },
      {
        name: 'IARD',
        remuneration: 'Linéaire',
        fields: [],
        comparativeProposals: []
      }
    ]
  },
  {
    name: 'ZENIOO',
    products: [
      {
        name: 'Assurance Emprunteur',
        remuneration: 'Frais de dossier',
        fields: [
          { type: 'frais_a_definir', label: 'Frais de dossier (€)', required: false }
        ],
        comparativeProposals: ['April', 'Neoliane']
      }
    ]
  },
  {
    name: 'SCPI',
    products: [
      {
        name: 'SCPI',
        remuneration: 'NSP',
        fields: [],
        comparativeProposals: ['Compte à Terme', 'Omega']
      }
    ]
  },
  {
    name: 'OMEGA (SPVIE)',
    products: [
      {
        name: 'Assurance Vie',
        remuneration: 'Versement initial + programmé + frais sur chacun',
        fields: [
          { type: 'versement_initial', label: 'Versement initial (€)', required: false },
          { type: 'versement_programme', label: 'Versement programmé (€)', required: false },
          { type: 'frais_chacun', label: 'Frais sur chacun (%)', required: false }
        ],
        comparativeProposals: ['Generali', 'MMA']
      }
    ]
  },
  {
    name: 'COMPTE À TERME',
    products: [
      {
        name: 'Compte à Terme',
        remuneration: 'NSP',
        fields: [],
        comparativeProposals: ['SCPI', 'Omega']
      }
    ]
  },
  {
    name: 'GIRARDIN (Star Invest)',
    products: [
      {
        name: 'Girardin',
        remuneration: 'Versement initial / Aucun frais',
        fields: [
          { type: 'versement_initial', label: 'Versement initial (€)', required: false }
        ],
        comparativeProposals: ['SCPI', 'Generali']
      }
    ]
  },
  {
    name: 'UNIM',
    products: [
      {
        name: 'Mutuelle',
        remuneration: '30/10',
        fields: [],
        comparativeProposals: ['April', 'SwissLife', 'Neoliane']
      },
      {
        name: 'Prévoyance',
        remuneration: '—',
        fields: [],
        comparativeProposals: ['SwissLife', 'Neoliane', 'Alptis']
      }
    ]
  }
];

export function getCompanyByName(companyName: string): CompanyConfig | undefined {
  return INSURANCE_COMPANIES.find(c => c.name === companyName);
}

export function getProductByName(companyName: string, productName: string): ProductConfig | undefined {
  const company = getCompanyByName(companyName);
  return company?.products.find(p => p.name === productName);
}

export function getAllCompanyNames(): string[] {
  return INSURANCE_COMPANIES.map(c => c.name);
}
