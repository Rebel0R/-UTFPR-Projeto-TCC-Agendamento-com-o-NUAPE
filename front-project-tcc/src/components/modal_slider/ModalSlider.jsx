import style from "./style.module.css";
import { MdClose } from "react-icons/md";

export default function ModalSlider({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className={style.modalSliderOVerlay}>
      <div className={`${style.modalSlider} ${isOpen ? "open" : ""}`}>
        <div className={style.modalSliderHeader}>
          <button className={style.closeButton} onClick={onClose}>
            <MdClose
              style={{ width: "1.5rem", height: "1.5rem", color: "#7a899f" }}
            />
          </button>
        </div>
        <div className={style.modalSliderContent}>{children}</div>
      </div>
    </div>
  );
}
