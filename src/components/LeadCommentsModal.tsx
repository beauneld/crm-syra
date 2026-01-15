import { X, MessageSquare, Send, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

interface LeadCommentsModalProps {
  leadId: string;
  leadName: string;
  onClose: () => void;
}

export default function LeadCommentsModal({ leadId, leadName, onClose }: LeadCommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    getCurrentUser();
  }, [leadId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('lead_comments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('lead_comments')
      .insert([{
        lead_id: leadId,
        user_id: user.id,
        content: newComment.trim()
      }]);

    if (!error) {
      setNewComment('');
      await loadComments();
    }
    setLoading(false);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('lead_comments')
      .update({
        content: editingContent.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (!error) {
      setEditingCommentId(null);
      setEditingContent('');
      await loadComments();
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;

    setLoading(true);
    const { error } = await supabase
      .from('lead_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      await loadComments();
    }
    setLoading(false);
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl my-4 flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Commentaires</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{leadName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-light">Aucun commentaire pour le moment</p>
                <p className="text-sm text-gray-400 dark:text-gray-400 font-light mt-1">Soyez le premier à commenter</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-2xl p-4 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                  {editingCommentId === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                        rows={3}
                        placeholder="Modifier le commentaire..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEditing}
                          disabled={loading}
                          className="px-4 py-2 text-sm font-light text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-all"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={loading || !editingContent.trim()}
                          className="px-4 py-2 bg-blue-50 dark:bg-blue-900/200 text-white text-sm font-light rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-light">
                            {comment.user_email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-light">{comment.user_email || 'Utilisateur'}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-400 font-light">{formatDate(comment.created_at)}</p>
                          </div>
                        </div>
                        {currentUserId === comment.user_id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditing(comment)}
                              className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-gray-800/80 dark:bg-gray-800/80 flex items-center justify-center transition-all"
                              title="Modifier"
                            >
                              <Pencil className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-gray-800/80 dark:bg-gray-800/80 flex items-center justify-center transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-light whitespace-pre-wrap">{comment.content}</p>
                      {comment.updated_at !== comment.created_at && (
                        <p className="text-xs text-gray-400 dark:text-gray-400 font-light mt-2">Modifié {formatDate(comment.updated_at)}</p>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                rows={2}
                placeholder="Ajouter un commentaire... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
              />
              <button
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center justify-center shadow-lg"
                title="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
