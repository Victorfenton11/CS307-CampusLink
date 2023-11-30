import React from 'react';
import './styles/Modal.css'; // Import the CSS file for styling

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        <button onClick={handleClose} className='modal-close-button'>Cancel</button>
        <br />
        {children}
      </section>
    </div>
  );
};

export default Modal;