import style from "./style.module.css";
import { MdClose } from "react-icons/md";

export default function ModalBox({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalBox}>
        <div className={style.modalHeader}>
          <button className={style.closeButton} onClick={onClose}>
            <MdClose
              style={{ width: "1.5rem", height: "1.5rem", color: "#7a899f" }}
            />
          </button>
        </div>
        <div className={style.modalContent}>{children}</div>
      </div>
    </div>
  );

  return null;
}
