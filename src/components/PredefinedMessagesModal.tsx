import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PredefinedMessage } from '../types';

interface PredefinedMessagesModalProps {
  onClose: () => void;
  onSelectMessage?: (message: PredefinedMessage) => void;
  mode?: 'select' | 'manage';
  category: 'description' | 'justification';
}

export default function PredefinedMessagesModal({
  onClose,
  onSelectMessage,
  mode = 'select',
  category
}: PredefinedMessagesModalProps) {
  const [messages, setMessages] = useState<PredefinedMessage[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: category as 'description' | 'justification'
  });
  const [currentList, setCurrentList] = useState<'description' | 'justification'>(category);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // If no user, use mock data for development
    if (!user) {
      const mockMessages: PredefinedMessage[] = [
        {
          id: '1',
          title: 'Couverture santé complète',
          content: 'Ce contrat offre une couverture santé complète avec une prise en charge optimale des frais médicaux, incluant l\'hospitalisation, les soins dentaires et l\'optique.',
          category: 'description',
          user_id: '00000000-0000-0000-0000-000000000000',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Protection adaptée aux besoins',
          content: 'Cette solution a été sélectionnée car elle correspond parfaitement à vos besoins exprimés et offre le meilleur rapport qualité-prix du marché.',
          category: 'justification',
          user_id: '00000000-0000-0000-0000-000000000000',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setMessages(mockMessages);
      return;
    }

    const { data, error } = await supabase
      .from('predefined_messages')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Mode développement - simuler la sauvegarde
      console.log('Mode développement - Message sauvegardé:', formData);
      alert('Mode développement: Le message sera sauvegardé une fois authentifié');
      resetForm();
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('predefined_messages')
        .update({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (!error) {
        loadMessages();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('predefined_messages')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (!error) {
        loadMessages();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('predefined_messages')
      .update({ is_active: false })
      .eq('id', id);

    if (!error) {
      loadMessages();
    }
  };

  const handleEdit = (message: PredefinedMessage) => {
    setFormData({
      title: message.title,
      content: message.content,
      category: message.category
    });
    setEditingId(message.id);
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: currentList
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const filteredMessages = messages.filter(m => m.category === currentList);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
                {mode === 'select' ? 'Sélectionner un message prédéfini' : 'Gérer les messages prédéfinis'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentList('description')}
                  className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                    currentList === 'description'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setCurrentList('justification')}
                  className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                    currentList === 'justification'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Justification
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!isCreating ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                      {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {mode === 'manage' && (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nouveau message
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border border-gray-200 rounded-2xl transition-all ${
                        mode === 'select' ? 'hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer' : 'bg-white'
                      }`}
                      onClick={() => mode === 'select' && onSelectMessage && onSelectMessage(message)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{message.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-light line-clamp-2">{message.content}</p>
                        </div>
                        {mode === 'manage' && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(message);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-400 dark:text-gray-400 font-light">Aucun message prédéfini</p>
                      {mode === 'manage' && (
                        <button
                          onClick={() => setIsCreating(true)}
                          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                        >
                          Créer le premier message
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Couverture santé complète"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>


                <div>
                  <label className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">Contenu</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    placeholder="Saisissez le contenu du message..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!formData.title || !formData.content}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isCreating && mode === 'manage' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
