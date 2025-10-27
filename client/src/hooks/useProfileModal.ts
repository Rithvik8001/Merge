import { useState } from "react";

interface UseProfileModalReturn {
  selectedUserId: string | null;
  isOpen: boolean;
  openProfile: (userId: string) => void;
  closeProfile: () => void;
}

export const useProfileModal = (): UseProfileModalReturn => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openProfile = (userId: string) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  const closeProfile = () => {
    setIsOpen(false);
    setSelectedUserId(null);
  };

  return {
    selectedUserId,
    isOpen,
    openProfile,
    closeProfile,
  };
};
