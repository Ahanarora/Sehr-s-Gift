import type { PropsWithChildren } from "react";
import "../App.css";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose: () => void;
}>;

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="bb-modal-backdrop" onClick={onClose}>
      <div
        className="bb-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="bb-modal-header">
          <h3>{title}</h3>
          <button className="bb-btn bb-ghost" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="bb-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
