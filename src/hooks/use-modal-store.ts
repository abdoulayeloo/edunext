// src/hooks/use-modal-store.ts
import { create } from "zustand";
import { Formation, Semester, UE, EC, User } from "@prisma/client";

export type ModalType =
    | "createSemester" | "editSemester"
    | "createUE" | "editUE"
    | "createEC" | "editEC"
    | "createFormation" | "editFormation";

interface ModalData {
    // Données pour l'édition
    formation?: Formation;
    semester?: Semester;
    ue?: UE;
    ec?: EC;
    // Données de contexte pour la création
    formationId?: string;
    semesterId?: string;
    ueId?: string;
    // Données supplémentaires pour les formulaires
    professors?: User[];
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false, data: {} }),
}));