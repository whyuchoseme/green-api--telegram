import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "@shared/api";
import { getInstanceData } from "@entities/instance";

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
  timestamp?: number;
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

    const timeNow = Date.now();

    setMessages((prev: Message[]) => [
      ...prev,
      { id: timeNow, text: messageText, type: "outgoing", timestamp: timeNow },
    ]);

    try {
      const response = await fetch(
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

      if (!response.ok) throw new Error("Ошибка сети");

      const data = await response.json();
      const finalUniqueId = data?.idMessage
        ? activeChat + "_" + data.idMessage
        : activeChat + "_" + timeNow;

      setMessages((prev: Message[]) =>
        prev.map((msg) =>
          msg.id === timeNow ? { ...msg, id: finalUniqueId } : msg,
        ),
      );
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  return { handleSendMessage };
};
