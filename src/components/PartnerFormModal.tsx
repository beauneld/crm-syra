import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Partner } from '../services/partnersService';

interface PartnerFormModalProps {
  onClose: () => void;
  onSave: (formData: { name: string; website_url: string; logo_file: File | null }) => Promise<void>;
  partner?: Partner | null;
}

export default function PartnerFormModal({ onClose, onSave, partner }: PartnerFormModalProps) {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setWebsiteUrl(partner.website_url);
      setLogoPreview(partner.logo_url);
      setLogoFile(null);
    } else {
      setName('');
      setWebsiteUrl('');
      setLogoFile(null);
      setLogoPreview('');
    }
    setError('');
  }, [partner]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La taille du fichier ne doit pas dépasser 5 MB');
      return;
    }

    setError('');
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Le nom du partenaire est requis');
      return;
    }

    if (!websiteUrl.trim()) {
      setError("L'URL du site web est requise");
      return;
    }

    if (!partner && !logoFile) {
      setError('Le logo est requis');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        website_url: websiteUrl.trim(),
        logo_file: logoFile,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">{partner ? 'Modifier le partenaire' : 'Ajouter un nouveau partenaire'}</h2>
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 px-4 py-3 rounded-2xl text-sm text-gray-900 dark:text-gray-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                Nom du partenaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Ex: Allianz"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                URL du site web <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="https://www.exemple.fr"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                Logo {!partner && <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-3">
                {logoPreview && (
                  <div className="relative w-32 h-32 mx-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Aperçu du logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <Upload className="w-4 h-4" />
                  {logoPreview ? 'Changer le logo' : 'Choisir un logo'}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light text-center">
                  Formats acceptés : PNG, JPG, SVG (max 5 MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Enregistrement...' : (partner ? 'Enregistrer' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
