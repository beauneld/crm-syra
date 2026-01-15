import { X, Download, Mail } from 'lucide-react';

interface ConseilViewerProps {
  conseil: any;
  onClose: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

export default function ConseilViewer({
  conseil,
  onClose,
  onDownload,
  onEmail
}: ConseilViewerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-light text-gray-900">Devoir de Conseil - {conseil.client_name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Télécharger"
              >
                <Download className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={onEmail}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Envoyer par email"
              >
                <Mail className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <section className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Nom:</span> {conseil.client_name}</div>
                  <div><span className="font-medium">Date:</span> {new Date(conseil.date_signature || conseil.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Situation et Besoins</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium">Situation familiale:</span> {conseil.situation_familiale || '-'}</div>
                  <div><span className="font-medium">Situation professionnelle:</span> {conseil.situation_professionnelle || '-'}</div>
                  <div><span className="font-medium">Besoins:</span> {conseil.besoins || '-'}</div>
                  <div><span className="font-medium">Risques:</span> {conseil.risques || '-'}</div>
                  <div><span className="font-medium">Budget:</span> {conseil.budget || '-'}</div>
                  <div><span className="font-medium">Projets:</span> {conseil.projets || '-'}</div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contrats</h3>
                {conseil.contrats && conseil.contrats.length > 0 ? (
                  <div className="space-y-4">
                    {conseil.contrats.map((contrat: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium">Type:</span> {contrat.contrat_type}</div>
                          <div><span className="font-medium">Nom:</span> {contrat.contrat_nom}</div>
                          <div><span className="font-medium">Garanties:</span> {contrat.garanties || '-'}</div>
                          <div><span className="font-medium">Exclusions:</span> {contrat.exclusions || '-'}</div>
                          <div><span className="font-medium">Limites:</span> {contrat.limites || '-'}</div>
                          <div><span className="font-medium">Conditions:</span> {contrat.conditions || '-'}</div>
                          <div><span className="font-medium">Options:</span> {contrat.options || '-'}</div>
                          <div><span className="font-medium">Montants:</span> {contrat.montants_garantie || '-'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucun contrat ajouté</p>
                )}
              </section>

              <section className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Produits et Garanties</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium">Produits proposés:</span> {conseil.produits_proposes || '-'}</div>
                  <div><span className="font-medium">Contrat choisi:</span> {conseil.contrat_choisi || '-'}</div>
                  <div><span className="font-medium">Garanties:</span> {conseil.garanties || '-'}</div>
                  <div><span className="font-medium">Exclusions:</span> {conseil.exclusions || '-'}</div>
                  <div><span className="font-medium">Limites:</span> {conseil.limites || '-'}</div>
                  <div><span className="font-medium">Conditions:</span> {conseil.conditions || '-'}</div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Adéquation et Signature</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Adéquation confirmée:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      conseil.adequation_confirmee
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {conseil.adequation_confirmee ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div><span className="font-medium">Risques en cas de refus:</span> {conseil.risques_refus || '-'}</div>
                  <div><span className="font-medium">Signature:</span> {conseil.signature_client || '-'}</div>
                  <div><span className="font-medium">Date de signature:</span> {conseil.date_signature ? new Date(conseil.date_signature).toLocaleDateString('fr-FR') : '-'}</div>
                </div>
              </section>

              {conseil.autres_remarques && (
                <section className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Remarques</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{conseil.autres_remarques}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
