import { create } from "zustand";

/**
 * Modal butonu konfigürasyonu.
 * - text:    Buton etiketi
 * - onPress: Tıklanınca çalışacak callback (modal otomatik kapanır, sonra çağrılır)
 * - mode:    "contained" (dolu) | "outlined" (çerçeveli) | "text" (sadece metin) — varsayılan: "contained"
 */
export type ModalButton = {
  text: string;
  onPress?: () => void;
  mode?: "contained" | "outlined" | "text";
};

/**
 * showModal çağrısında verilen konfigürasyon.
 * - title:       Modal başlığı
 * - description: Modal açıklaması (opsiyonel)
 * - buttons:     Buton listesi (opsiyonel)
 */
export type ModalConfig = {
  title: string;
  description?: string;
  buttons?: ModalButton[];
};

type ModalState = {
  visible: boolean;
  title: string;
  description: string;
  buttons: ModalButton[] | null;

  /** Modalı verilen içerikle gösterir. */
  showModal: (config: ModalConfig) => void;
  /** Modalı gizler. */
  hideModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  title: "",
  description: "",
  buttons: null,

  showModal: (config) =>
    set({
      visible: true,
      title: config.title,
      description: config.description ?? "",
      buttons: config.buttons ?? null,
    }),

  hideModal: () =>
    set({
      visible: false,
    }),
}));