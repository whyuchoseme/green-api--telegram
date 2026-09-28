import { getInstanceData } from "@entities/instance";
import { API_URL } from "@shared/api";
import { useState, useEffect } from "react";

type Chat = {
  chatId: string;
  name: string;
};

type StringMap = {
  [key: string]: string;
};

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>(
    localStorage.getItem("lastChat") || "",
  );

  const [chatNamesMap, setChatNamesMap] = useState<StringMap>(() => {
    return JSON.parse(localStorage.getItem("chatNamesMap") || "{}");
  });

  const [cachedNames, setCachedNames] = useState<StringMap>(() => {
    return JSON.parse(localStorage.getItem("cachedNames") || "{}");
  });

  const [isChatsLoading, setIsChatsLoading] = useState<boolean>(true);

  const fetchChats = async () => {
    const credentials = getInstanceData();
    if (!credentials) return;

    setIsChatsLoading(true);
    try {
      const response = await fetch(
        API_URL +
          "/waInstance" +
          credentials.idInstance +
          "/getChats/" +
          credentials.apiTokenInstance,
      );
      if (response.ok) {
        const data = (await response.json()) as unknown;
        if (Array.isArray(data)) {
          setChats(data as Chat[]);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    } finally {
      setIsChatsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchChats();
    });
  }, []);

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    localStorage.setItem("lastChat", chatId);
  };

  return {
    chats,
    setChats,
    activeChat,
    chatNamesMap,
    setChatNamesMap,
    cachedNames,
    setCachedNames,
    isChatsLoading,
    handleSelectChat,
  };
};
