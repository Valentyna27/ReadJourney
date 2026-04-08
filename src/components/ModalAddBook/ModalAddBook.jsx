import AnotherCommonModal from '../AnotherCommonModal/AnotherCommonModal';

export default function ModalAddBook({
  book,
  onClose,
  isOpen,
  onAdd,
  isAlreadyAdded,
}) {
  const buttonText = isAlreadyAdded ? 'Already in library' : 'Add to library';
  const handleClick = () => {
    if (isAlreadyAdded) return;
    onAdd(book);
    onClose();
  };

  return (
    <AnotherCommonModal
      onClose={onClose}
      book={book}
      isOpen={isOpen}
      handleClick={handleClick}
      buttonText={buttonText}
      isAlreadyAdded={isAlreadyAdded}
    />
  );
}
