interface SignatureModalProps {
  signatureType: 'immediate' | 'email';
  onClose: () => void;
  onValidate: () => void;
  onValidateLater: () => void;
}

export default function SignatureModal({
  signatureType,
  onClose,
  onValidate,
  onValidateLater
}: SignatureModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {signatureType === 'immediate' ? 'Joindre le suivi de dossier papier' : 'Joindre l\'enregistrement'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {signatureType === 'immediate'
              ? 'Veuillez joindre le suivi de dossier papier pour finaliser la signature immédiate.'
              : 'Vous pouvez joindre l\'enregistrement (non obligatoire).'}
          </p>
          <div className="mb-6">
            <label className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">
              Document {signatureType === 'email' && '(optionnel)'}
            </label>
            <input
              type="file"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onValidateLater}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all"
            >
              Valider plus tard
            </button>
            <button
              onClick={onValidate}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
