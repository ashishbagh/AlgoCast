import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const state = [
  {
    id: 1,
    priority: 1,
    isActive: false,
    content: "Info Modal",
  },
  {
    id: 5,
    priority: 5,
    isActive: false,
    content: "Warning Modal",
  },
  {
    id: 10,
    priority: 10,
    isActive: false,
    content: "Critical Modal",
  },
];

const useManager = () => {
  const [priority, setPriority] = useState(state);

  const [activeModalId, setActiveModalId] = useState(null);

  const closeAll = () => {
    setActiveModalId(null);
  };

  const activeModal = useMemo(() => {
    return priority.find((modal) => activeModalId == modal.priority) || null;
  }, [priority, activeModalId]);

  const openModal = (id) => {
    const requestedModal = priority.find((item) => item.id === id);
    if (!requestedModal) return;

    if (!activeModal) {
      setActiveModalId(requestedModal.id);
      return;
    }

    if (requestedModal.priority > activeModal.priority) {
      setActiveModalId(requestedModal.id);
      return;
    }
  };

  const closeModal = (id) => {
    setActiveModalId(null);
  };

  return { activeModal, closeAll, openModal, closeModal };
};

export default useManager;
