import Modal from './Modal';
import { useModal } from '../hooks/useModal';

export default function ExampleModalUsage() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/200 text-white rounded-lg">
        Ouvrir la modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Exemple de modal"
        maxWidth="800px"
      >
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 font-light mb-4">
            Cette modal est centrée sur la page et le flou ne s'applique que sur la zone de contenu à droite (#contentRight).
          </p>
          <p className="text-gray-700 dark:text-gray-300 font-light mb-4">
            La sidebar reste nette et non floutée.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={close}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                console.log('Action confirmée');
                close();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
