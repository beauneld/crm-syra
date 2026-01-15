interface CommentaireTabProps {
  commentairesInternes: string;
  savedComment: string;
  isCommentSaved: boolean;
  onUpdateComment: (value: string) => void;
  onSaveComment: () => void;
}

export default function CommentaireTab({
  commentairesInternes,
  savedComment,
  isCommentSaved,
  onUpdateComment,
  onSaveComment
}: CommentaireTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          <span className="text-red-500">*</span> Commentaires internes (non visible client)
        </label>
        <textarea
          value={commentairesInternes}
          onChange={(e) => onUpdateComment(e.target.value)}
          rows={6}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 resize-none"
          placeholder="Remarques internes sur ce dossier..."
          required
        />
        <button
          type="button"
          onClick={onSaveComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-normal hover:bg-blue-600 transition-colors"
        >
          {isCommentSaved ? 'Modifier' : 'Ajouter'}
        </button>

        {isCommentSaved && savedComment && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Commentaire enregistré :</h4>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{savedComment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
