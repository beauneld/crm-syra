import { useState } from 'react';
import SignatureText from './SignatureText';

interface SignatureSectionProps {
  formData: any;
  contracts: any[];
  onSignatureImmediate: () => void;
  onSignatureEmail: () => void;
  onPreview: () => void;
}

export default function SignatureSection({
  formData,
  contracts,
  onSignatureImmediate,
  onSignatureEmail,
  onPreview
}: SignatureSectionProps) {
  const [showOnlyRecommendedContracts, setShowOnlyRecommendedContracts] = useState(true);
  return (
    <div>
      <h3 className="text-center text-base font-normal text-gray-800 mb-6">Texte de signature électronique</h3>

      <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200/50">
        <SignatureText formData={formData} contracts={contracts} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyRecommendedContracts}
            onChange={(e) => setShowOnlyRecommendedContracts(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm font-light text-gray-700">Afficher uniquement les contrats de la gamme préconisée</span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onSignatureImmediate}
            className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
          >
            Signature immédiate
          </button>
          <button
            onClick={onSignatureEmail}
            className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
          >
            Signature par email
          </button>
        </div>
        <button
          onClick={onPreview}
          className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
        >
          Prévisualiser
        </button>
      </div>
    </div>
  );
}
