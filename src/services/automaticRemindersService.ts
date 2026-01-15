import { createMemo } from './memosService';
import { getProductType } from './csvProductsService';

export interface ContractReminderData {
  produit: string;
  compagnie?: string;
  per_existant?: boolean;
  assurance_vie_existante?: boolean;
  rachat_effectue?: boolean;
  contrat_renouvellement_remplacement?: 'nouveau' | 'renouvellement' | 'remplacement' | '';
  date_effet?: string;
}

interface ReminderConfig {
  title: string;
  description: string | null;
  daysOffset: number;
}

function getDateWithOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getReminderForPER(contractData: ContractReminderData): ReminderConfig | null {
  if (contractData.per_existant) {
    return {
      title: 'Faire demande de transfert + suspension des versements sur l\'ancien PER',
      description: `Contrat concerné : ${contractData.produit}`,
      daysOffset: 1
    };
  }
  return null;
}

function getReminderForAssuranceVie(contractData: ContractReminderData): ReminderConfig | null {
  if (contractData.assurance_vie_existante && contractData.rachat_effectue) {
    return {
      title: 'Suivi du rachat total ou partiel',
      description: `Contrat concerné : ${contractData.produit}`,
      daysOffset: 1
    };
  }
  return null;
}

function getReminderForMutuelle(contractData: ContractReminderData): ReminderConfig {
  const daysOffset = contractData.date_effet ? 330 : 0; // ~11 months

  return {
    title: 'Rappel renouvellement Mutuelle Santé',
    description: `Contrat : ${contractData.produit}. Rappel automatique vers Service Client.`,
    daysOffset
  };
}

function getReminderForPrevoyance(contractData: ContractReminderData): ReminderConfig[] {
  const reminders: ReminderConfig[] = [];

  // Rappel à 11 mois pour tous les contrats Prévoyance
  const daysOffset11Months = contractData.date_effet ? 330 : 0;
  reminders.push({
    title: 'Rappel renouvellement Prévoyance',
    description: `Contrat : ${contractData.produit}. Rappel automatique vers Service Client.`,
    daysOffset: daysOffset11Months
  });

  // Rappel J+1 pour renouvellement ou remplacement
  const statut = contractData.contrat_renouvellement_remplacement;
  if (statut === 'renouvellement' || statut === 'remplacement') {
    reminders.push({
      title: 'Avez-vous effectué la RIA (résiliation ou non reconduction) ?',
      description: `Contrat en ${statut} : ${contractData.produit}`,
      daysOffset: 1
    });
  }

  return reminders;
}

function getReminderForAssuranceEmprunteur(contractData: ContractReminderData): ReminderConfig {
  return {
    title: 'Appeler le client pour vérification de l\'avenant bancaire',
    description: `Contrat concerné : ${contractData.produit}`,
    daysOffset: 21
  };
}

function getReminderForObseques(contractData: ContractReminderData): ReminderConfig {
  const daysOffset = contractData.date_effet ? 330 : 0; // ~11 months

  return {
    title: 'Rappel renouvellement Obsèques',
    description: `Contrat : ${contractData.produit}. Rappel automatique vers Service Client. RIA à effectuer.`,
    daysOffset
  };
}

function normalizeProductType(type: string): string {
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

export async function createAutomaticReminder(
  contractData: ContractReminderData,
  userId: string,
  organizationId: string
): Promise<{ success: boolean; message: string; reminderCreated: boolean }> {
  try {
    // Get product type from CSV if compagnie is provided
    let productType: string | null = null;
    if (contractData.compagnie) {
      productType = getProductType(contractData.compagnie, contractData.produit);
    }

    if (!productType) {
      return {
        success: true,
        message: 'Type de produit non trouvé',
        reminderCreated: false
      };
    }

    const normalizedType = normalizeProductType(productType);
    const reminders: ReminderConfig[] = [];

    switch (normalizedType) {
      case 'PER': {
        const config = getReminderForPER(contractData);
        if (config) reminders.push(config);
        break;
      }

      case 'Assurance vie': {
        const config = getReminderForAssuranceVie(contractData);
        if (config) reminders.push(config);
        break;
      }

      case 'Mutuelle': {
        const config = getReminderForMutuelle(contractData);
        reminders.push(config);
        break;
      }

      case 'Prevoyance': {
        const configs = getReminderForPrevoyance(contractData);
        reminders.push(...configs);
        break;
      }

      case 'Assurance Emprunteur': {
        const config = getReminderForAssuranceEmprunteur(contractData);
        reminders.push(config);
        break;
      }

      case 'Obseque': {
        const config = getReminderForObseques(contractData);
        reminders.push(config);
        break;
      }

      case 'IARD':
      case 'Girardin':
      case 'SCPI':
        // No automatic reminders for these types
        return {
          success: true,
          message: 'Aucun rappel automatique pour ce type de contrat',
          reminderCreated: false
        };

      default:
        return {
          success: true,
          message: 'Aucun rappel automatique pour ce type de contrat',
          reminderCreated: false
        };
    }

    if (reminders.length === 0) {
      return {
        success: true,
        message: 'Aucun rappel nécessaire pour cette configuration',
        reminderCreated: false
      };
    }

    // Create all reminders
    const messages: string[] = [];
    for (const reminderConfig of reminders) {
      const dueDate = getDateWithOffset(reminderConfig.daysOffset);
      const dueTime = getCurrentTime();

      await createMemo(
        userId,
        organizationId,
        reminderConfig.title,
        reminderConfig.description,
        dueDate,
        dueTime
      );

      let message = `"${reminderConfig.title}"`;
      if (reminderConfig.daysOffset > 0) {
        message += ` (prévu dans ${reminderConfig.daysOffset} jours)`;
      }
      messages.push(message);
    }

    const finalMessage = reminders.length > 1
      ? `${reminders.length} rappels automatiques créés : ${messages.join(', ')}`
      : `Rappel automatique créé : ${messages[0]}`;

    return {
      success: true,
      message: finalMessage,
      reminderCreated: true
    };

  } catch (error) {
    console.error('Erreur lors de la création du rappel automatique:', error);
    return {
      success: false,
      message: 'Erreur lors de la création du rappel automatique',
      reminderCreated: false
    };
  }
}

export function getProductTypeDisplayName(type: string): string {
  const normalized = normalizeProductType(type);
  switch (normalized) {
    case 'PER':
      return 'Plan Épargne Retraite';
    case 'Assurance vie':
      return 'Assurance Vie / Épargne';
    case 'Mutuelle':
      return 'Mutuelle Santé';
    case 'Prevoyance':
      return 'Prévoyance';
    case 'Assurance Emprunteur':
      return 'Assurance Emprunteur';
    case 'IARD':
      return 'IARD';
    case 'Obseque':
      return 'Obsèques';
    case 'Girardin':
      return 'Girardin';
    case 'SCPI':
      return 'SCPI';
    default:
      return 'Autre';
  }
}
