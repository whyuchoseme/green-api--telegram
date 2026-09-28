import { getInstanceData } from "@entities/instance";
import { API_URL } from "@shared/api";
import { useState, useEffect } from "react";

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
};

type HistoryMessageDto = {
  idMessage: string;
  type: string;
  textMessage?: string;
  extendedTextMessage?: { text: string };
};

export const useMessages = (activeChat: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(
    !!localStorage.getItem("lastChat"),
  );

  const fetchHistory = async (chatId: string) => {
    const credentials = getInstanceData();
    if (!credentials) return;

    setIsHistoryLoading(true);
    try {
      const response = await fetch(
        API_URL +
          "/waInstance" +
          credentials.idInstance +
          "/getChatHistory/" +
          credentials.apiTokenInstance,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: chatId, count: 50 }),
        },
      );
      if (response.ok) {
        const data = (await response.json()) as unknown;
        if (Array.isArray(data)) {
          const formattedMessages = data.reverse().map((msg: unknown) => {
            const m = msg as HistoryMessageDto;
            return {
              id: m.idMessage,
              text:
                m.textMessage || m.extendedTextMessage?.text || "[Сообщение]",
              type: m.type === "outgoing" ? "outgoing" : "incoming",
            } as Message;
          });
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      if (activeChat) {
        fetchHistory(activeChat);
      }
    });
  }, [activeChat]);

  return {
    messages,
    setMessages,
    isHistoryLoading,
  };
};
