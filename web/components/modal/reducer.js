export const MODAL_OPEN = 'Modal/OPEN';
export const MODAL_CLOSE = 'Modal/CLOSE';

export const openModal = (name) => ({ name, type: MODAL_OPEN });
export const closeModal = (name) => ({ name, type: MODAL_CLOSE });

export default function modalReducer(modal = {}, { name, type } = {}) {
  let returnModal;

  switch (type) {
    case MODAL_OPEN: {
      returnModal = { current: name };
      break;
    };
    case MODAL_CLOSE: {
      if (modal.current === name) {
        returnModal = {};
      } else {
        returnModal = modal;
      }
      break;
    }
    default: {
      returnModal = modal;
      break;
    }
  }

  return returnModal;
}
