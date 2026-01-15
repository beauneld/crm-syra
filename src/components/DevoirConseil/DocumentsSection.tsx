import { Download } from 'lucide-react';

export default function DocumentsSection() {
  return (
    <div>
      <p className="text-sm font-light text-gray-600 mb-6">Format : JPEG, PNG, PDF - Poids : 5Mo maximum</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between py-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-sm font-normal text-gray-800 mb-1">Pièce d'identité</h3>
            <p className="text-xs text-gray-500 font-light">CNI recto verso ou page avec la photo sur le passeport.</p>
          </div>
          <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-sm font-normal text-gray-800 mb-1">RIB</h3>
            <p className="text-xs text-gray-500 font-light">Le Relevé d'identité bancaire (RIB).</p>
          </div>
          <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>

        <div className="flex items-start justify-between py-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-sm font-normal text-gray-800 mb-1">Justificatif de domicile</h3>
            <p className="text-xs text-gray-500 font-light">Facture (électricité...) datant de moins d'un an à votre nom.</p>
          </div>
          <button className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>

        <div className="flex items-start justify-between py-4">
          <div className="flex-1">
            <h3 className="text-sm font-normal text-gray-800 mb-1">Autres</h3>
            <p className="text-xs text-gray-500 font-light">Autres type de documents</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-light text-blue-600">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
