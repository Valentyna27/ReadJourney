import { useNavigate } from 'react-router-dom';
import AnotherCommonModal from '../AnotherCommonModal/AnotherCommonModal';

export default function StartReadingModal({ book, onClose, isOpen }) {
  const navigate = useNavigate();

  const buttonText = 'Start reading';

  const handleClick = () => {
    navigate('/reading', { state: { book } });
  };

  return (
    <AnotherCommonModal
      onClose={onClose}
      book={book}
      isOpen={isOpen}
      buttonText={buttonText}
      handleClick={handleClick}
    />
  );
}
