import { X } from 'lucide-react';

const DeleteButton = ({ onClick, disabled }) => {
  return (
    <button className="delete-button" onClick={onClick} disabled={disabled} type="button">
      <X strokeWidth={2.5} />
      Delete
    </button>
  );
};

export default DeleteButton;
