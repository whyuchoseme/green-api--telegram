import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "@shared/api";
import { getInstanceData } from "@entities/instance";

type ContactInfoDto = {
  chatId?: string;
  name?: string;
  username?: string;
};

type Chat = {
  chatId: string;
  name: string;
};

type StringMap = {
  [key: string]: string;
};

type UseCreateChatParams = {
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setChatNamesMap: Dispatch<SetStateAction<StringMap>>;
  setCachedNames: Dispatch<SetStateAction<StringMap>>;
  handleSelectChat: (chatId: string) => void;
};

export const useCreateChat = ({
  setChats,
  setChatNamesMap,
  setCachedNames,
  handleSelectChat,
}: UseCreateChatParams) => {
  const handleCreateChat = async (phoneNumber: string) => {
    const credentials = getInstanceData();
    if (!credentials) return "Ошибка авторизации";

    const rawInput = phoneNumber.trim();
    if (!rawInput) return "";

    let cleanInput = rawInput.replace(/\D/g, "");
    if (cleanInput.length === 11 && cleanInput.startsWith("8")) {
      cleanInput = "7" + cleanInput.slice(1);
    }

    if (cleanInput.length !== 11 || !cleanInput.startsWith("7")) {
      return `Проверьте правильность ввода номера.
      Принимаются только номера РФ/РК`;
    }

    const currentMap = JSON.parse(localStorage.getItem("chatNamesMap") || "{}");
    let existingChatId = "";

    for (const [key, value] of Object.entries(currentMap)) {
      if (String(value) === cleanInput) {
        existingChatId = key;
        break;
      }
    }

    if (existingChatId) {
      handleSelectChat(existingChatId);
      return "";
    }

    try {
      let data: ContactInfoDto | null = null;
      const res = await fetch(
        API_URL +
          "/waInstance" +
          credentials.idInstance +
          "/getContactInfo/" +
          credentials.apiTokenInstance,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: cleanInput + "@c.us" }),
        },
      );

      if (res.ok) {
        const json = (await res.json()) as unknown;

        if (
          json &&
          typeof json === "object" &&
          ("name" in json || "username" in json)
        ) {
          data = json as ContactInfoDto;
        }
      }

      if (data) {
        const realChatId = data.chatId || cleanInput;
        const displayName = data.name || data.username || cleanInput;

        setChatNamesMap((prev: StringMap) => {
          const newMap = { ...prev, [realChatId]: cleanInput };
          localStorage.setItem("chatNamesMap", JSON.stringify(newMap));
          return newMap;
        });

        setCachedNames((prev: StringMap) => {
          const newNames = { ...prev, [realChatId]: displayName };
          localStorage.setItem("cachedNames", JSON.stringify(newNames));
          return newNames;
        });

        setChats((prevChats: Chat[]) => {
          if (!prevChats.some((c: Chat) => c.chatId === realChatId)) {
            return [{ chatId: realChatId, name: displayName }, ...prevChats];
          }
          return prevChats;
        });

        handleSelectChat(realChatId);
        return "";
      } else {
        return "Пользователь с таким номером не найден";
      }
    } catch (error) {
      console.error("Ошибка пробивки номера:", error);
      handleSelectChat(cleanInput);
      return "";
    }
  };

  return { handleCreateChat };
};
