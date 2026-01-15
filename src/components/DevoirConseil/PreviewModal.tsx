import { X } from 'lucide-react';
import SignatureText from './SignatureText';

interface PreviewModalProps {
  formData: any;
  propositions: string[];
  propositionDates: { [key: string]: string };
  contracts: any[];
  onClose: () => void;
}

export default function PreviewModal({
  formData,
  propositions,
  propositionDates,
  contracts,
  onClose
}: PreviewModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl my-4 flex flex-col border border-gray-200 dark:border-gray-700/50 pointer-events-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Prévisualisation - Devoir de Conseil</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">1. Informations</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Civilité:</span> {formData.civilite || '-'}</div>
                  <div><span className="font-medium">Nom:</span> {formData.nom || '-'}</div>
                  <div><span className="font-medium">Prénom:</span> {formData.prenom || '-'}</div>
                  <div><span className="font-medium">Téléphone:</span> {formData.telephone || '-'}</div>
                  <div><span className="font-medium">Email:</span> {formData.email || '-'}</div>
                  <div><span className="font-medium">Site internet:</span> {formData.site_internet || '-'}</div>
                  <div><span className="font-medium">TNS:</span> {formData.actif ? 'Oui' : 'Non'}</div>
                  <div><span className="font-medium">Adresse:</span> {formData.adresse || '-'}</div>
                  <div><span className="font-medium">Ville:</span> {formData.ville || '-'}</div>
                  <div><span className="font-medium">Code postal:</span> {formData.code_postal || '-'}</div>
                  <div><span className="font-medium">Date de naissance:</span> {formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : '-'}</div>
                  <div><span className="font-medium">Statut professionnel:</span> {formData.statut_professionnel || '-'}</div>
                  <div><span className="font-medium">Profession:</span> {formData.profession || '-'}</div>
                  <div><span className="font-medium">Caisse professionnelle:</span> {formData.caisse_professionnelle || '-'}</div>
                  <div><span className="font-medium">Rémunération:</span> {formData.remuneration || '-'}</div>
                  <div><span className="font-medium">Dividende:</span> {formData.dividende || '-'}</div>
                  <div><span className="font-medium">Crédit en cours:</span> {formData.credit_en_cours || '-'}</div>
                  <div><span className="font-medium">Autres revenus:</span> {formData.autres_revenus || '-'}</div>
                  <div><span className="font-medium">Situation familiale:</span> {formData.situation_familiale || '-'}</div>
                  <div><span className="font-medium">Situation professionnelle:</span> {formData.situation_professionnelle || '-'}</div>
                  <div className="col-span-2"><span className="font-medium">Projets:</span> {formData.projets || '-'}</div>
                  {formData.commentaire && (
                    <div className="col-span-2">
                      <span className="font-medium">Commentaire:</span>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-900 dark:text-gray-100 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.commentaire}</div>
                    </div>
                  )}
                  {formData.apporteur_affaires && (
                    <div className="col-span-2"><span className="font-medium">Apporteur d'affaires:</span> {formData.apporteur_affaires}</div>
                  )}
                  {formData.commentaires_internes && (
                    <div className="col-span-2">
                      <span className="font-medium">Commentaires internes:</span>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-900 dark:text-gray-100 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.commentaires_internes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">2. Analyse des propositions</h3>
                {propositions.map((prop, index) => (
                  <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{prop}</span>
                    {propositionDates[prop] && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        - Date d'effet: {new Date(propositionDates[prop]).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">3. Les Contrats</h3>
                {contracts.map((contract, index) => (
                  <div key={index} className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{contract.gamme_contrat}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Assureur: {contract.assureur}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">4. Préconisation et conseils</h3>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Assureurs interrogés</h4>
                  {contracts.map((contract, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-medium text-sm mb-2">{contract.gamme_contrat}</div>
                      <div className="flex flex-wrap gap-2">
                        {contract.assureurs_interroges?.map((assureur: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {assureur}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Texte de signature électronique</h3>
                <SignatureText formData={formData} contracts={contracts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
