import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "@shared/api";
import { getInstanceData } from "@entities/instance";

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
};

type UseSendMessageParams = {
  activeChat: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export const useSendMessage = ({
  activeChat,
  setMessages,
}: UseSendMessageParams) => {
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !activeChat) return;

    const credentials = getInstanceData();
    if (!credentials) return;

    // Сразу добавляем сообщение в UI, как у тебя и было
    setMessages((prev: Message[]) => [
      ...prev,
      { id: Date.now(), text: messageText, type: "outgoing" },
    ]);

    try {
      await fetch(
        API_URL +
          "/waInstance" +
          credentials.idInstance +
          "/sendMessage/" +
          credentials.apiTokenInstance,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: activeChat, message: messageText }),
        },
      );
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  return { handleSendMessage };
};
