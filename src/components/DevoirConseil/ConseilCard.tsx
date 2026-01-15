import { Eye, Download, Mail, Pencil, Trash2 } from 'lucide-react';

interface ConseilCardProps {
  conseil: any;
  onView: () => void;
  onDownload: () => void;
  onEmail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ConseilCard({
  conseil,
  onView,
  onDownload,
  onEmail,
  onEdit,
  onDelete
}: ConseilCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{conseil.client_name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(conseil.date_signature || conseil.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Visualiser"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Télécharger"
          >
            <Download className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={onEmail}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Envoyer par email"
          >
            <Mail className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Pencil className="w-4 h-4 text-yellow-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Contrat:</span>
          <span className="font-medium text-gray-900">{conseil.contrat_choisi || '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Budget:</span>
          <span className="font-medium text-gray-900">{conseil.budget || '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Statut:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            conseil.adequation_confirmee
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {conseil.adequation_confirmee ? 'Confirmé' : 'En attente'}
          </span>
        </div>
      </div>
    </div>
  );
}
