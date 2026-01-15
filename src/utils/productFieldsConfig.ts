export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'select' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export interface DateConfig {
  showDateSouscription: boolean;
  showDateEffet: boolean;
  showDateEcheance: boolean;
  calculateEcheance?: boolean; // true = auto calculate +13 months from date_effet
}

export interface FinancialFieldsConfig {
  fields: FieldConfig[];
  replaceMontantInitialVersementProgramme?: boolean;
  singlePrimeField?: boolean;
}

export function getDateConfigForType(productType: string): DateConfig {
  const normalized = productType.toLowerCase().trim();

  switch (normalized) {
    case 'per':
      return {
        showDateSouscription: true,
        showDateEffet: true,
        showDateEcheance: false
      };

    case 'mutuelle':
    case 'prevoyance':
    case 'obseque':
      return {
        showDateSouscription: true,
        showDateEffet: true,
        showDateEcheance: true,
        calculateEcheance: true // +13 months
      };

    case 'assurance vie':
    case 'assurance emprunteur':
    case 'girardin':
      return {
        showDateSouscription: true,
        showDateEffet: true,
        showDateEcheance: false
      };

    case 'iard':
      return {
        showDateSouscription: true,
        showDateEffet: true,
        showDateEcheance: false
      };

    default:
      return {
        showDateSouscription: true,
        showDateEffet: true,
        showDateEcheance: true
      };
  }
}

export function getFinancialFieldsForType(productType: string): FinancialFieldsConfig {
  const normalized = productType.toLowerCase().trim();

  switch (normalized) {
    case 'per':
      return {
        fields: [
          { name: 'vp_mois', label: 'VP / mois (€)', type: 'text' },
          { name: 'frais_versement', label: 'Frais de versement (%)', type: 'text' }
        ]
      };

    case 'mutuelle':
      return {
        fields: [
          { name: 'montant_prime', label: 'Montant de la prime (€)', type: 'text' },
          { name: 'versement_programme', label: 'Versement programmé (€)', type: 'text' }
        ],
        singlePrimeField: true
      };

    case 'prevoyance':
      return {
        fields: [
          { name: 'montant_prime', label: 'Montant de la prime (€)', type: 'text' },
          { name: 'versement_programme', label: 'Versement programmé (€)', type: 'text' }
        ],
        singlePrimeField: true
      };

    case 'assurance vie':
      return {
        fields: [
          { name: 'versement_initial', label: 'Versement initial (€)', type: 'text' },
          { name: 'frais_versement_vi', label: 'Frais de versement (VI) (%)', type: 'text' },
          { name: 'vp_mois', label: 'VP / mois (€)', type: 'text' },
          { name: 'frais_versement', label: 'Frais de versement (%)', type: 'text' },
          { name: 'allocation_actifs', label: 'Allocation d\'actifs', type: 'textarea', placeholder: 'Ex: 60% Actions, 40% Obligations' }
        ]
      };

    case 'assurance emprunteur':
      return {
        fields: [
          { name: 'frais_dossier', label: 'Frais de dossier (€)', type: 'text' },
          { name: 'montant_prime', label: 'Montant de la prime (€)', type: 'text' }
        ],
        replaceMontantInitialVersementProgramme: true
      };

    case 'iard':
      return {
        fields: [
          { name: 'montant_prime', label: 'Montant de la prime (€)', type: 'text' }
        ],
        singlePrimeField: true
      };

    case 'obseque':
      return {
        fields: [
          { name: 'montant_prime', label: 'Montant de la prime (€)', type: 'text' },
          { name: 'versement_programme', label: 'Versement programmé (€)', type: 'text' }
        ],
        singlePrimeField: true
      };

    case 'girardin':
      return {
        fields: [
          { name: 'montant_versement', label: 'Montant du versement (€)', type: 'text' },
          { name: 'versement_programme', label: 'Versement programmé (€)', type: 'text' }
        ]
      };

    default:
      return {
        fields: [
          { name: 'montant_initial', label: 'Montant initial (€)', type: 'text' },
          { name: 'versement_programme', label: 'Versement programmé (€)', type: 'text' }
        ]
      };
  }
}

export function shouldShowPERExistantField(productType: string): boolean {
  return productType.toLowerCase().trim() === 'per';
}

export function shouldShowAssuranceVieExistanteField(productType: string): boolean {
  return productType.toLowerCase().trim() === 'assurance vie';
}

export function shouldShowPrevoyanceRenouvellementField(productType: string): boolean {
  return productType.toLowerCase().trim() === 'prevoyance';
}

export function shouldShowGirardinDocumentUpload(productType: string): boolean {
  return productType.toLowerCase().trim() === 'girardin';
}

export function calculateEcheanceDate(dateEffet: string): string {
  if (!dateEffet) return '';

  const date = new Date(dateEffet);
  date.setMonth(date.getMonth() + 13);
  return date.toISOString().split('T')[0];
}
