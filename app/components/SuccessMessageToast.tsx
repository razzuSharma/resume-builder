import React, { useEffect } from "react";
import { Transition } from "@headlessui/react";

interface SuccessMessageToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const SuccessMessageToast: React.FC<SuccessMessageToastProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <Transition
      appear
      show={isVisible}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-6 py-4 rounded-md shadow-md">
        <p>{message}</p>
      </div>
    </Transition>
  );
};

export default SuccessMessageToast