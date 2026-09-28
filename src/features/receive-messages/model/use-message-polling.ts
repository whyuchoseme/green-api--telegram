import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "@shared/api";
import { getInstanceData } from "@entities/instance";

type Chat = {
  chatId: string;
  name: string;
};

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
};

type StringMap = {
  [key: string]: string;
};

type ContactInfoDto = {
  chatId?: string;
  name?: string;
  username?: string;
};

type NotificationDto = {
  receiptId: number;
  body?: {
    typeWebhook: string;
    idMessage?: string;
    senderData?: {
      chatId?: string;
      senderPhoneNumber?: string | number;
      senderName?: string;
      chatName?: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
};

type UseMessagePollingParams = {
  activeChat: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setCachedNames: Dispatch<SetStateAction<StringMap>>;
  setChatNamesMap: Dispatch<SetStateAction<StringMap>>;
};

export const useMessagePolling = ({
  activeChat,
  setMessages,
  setChats,
  setCachedNames,
  setChatNamesMap,
}: UseMessagePollingParams) => {
  useEffect(() => {
    let isPolling = true;
    const controller = new AbortController();
    const credentials = getInstanceData();

    if (!credentials) return;

    const pollMessages = async () => {
      while (isPolling) {
        try {
          const response = await fetch(
            API_URL +
              "/waInstance" +
              credentials.idInstance +
              "/receiveNotification/" +
              credentials.apiTokenInstance,
            { signal: controller.signal },
          );

          if (response.status === 408) continue;
          if (!response.ok) throw new Error("Network response was not ok");

          const rawData = (await response.json()) as unknown;

          if (
            rawData &&
            typeof rawData === "object" &&
            "receiptId" in rawData
          ) {
            const data = rawData as NotificationDto;

            if (data.receiptId) {
              const body = data.body;
              if (body && body.typeWebhook === "incomingMessageReceived") {
                let incomingText = "";

                if (body.messageData?.typeMessage === "textMessage") {
                  incomingText =
                    body.messageData.textMessageData?.textMessage || "";
                } else {
                  throw Error(
                    `Неверный формат получаемого сообщения. Поддерживается только текстовый формат - "textMessage"`,
                  );
                }

                if (incomingText) {
                  const uniqueId = body.idMessage || String(data.receiptId);
                  const incomingChatId = body.senderData?.chatId || activeChat;
                  const incomingPhone = String(
                    body.senderData?.senderPhoneNumber || "",
                  );
                  let incomingName =
                    body.senderData?.senderName ||
                    body.senderData?.chatName ||
                    "";

                  if (!incomingName) {
                    try {
                      const infoRes = await fetch(
                        API_URL +
                          "/waInstance" +
                          credentials.idInstance +
                          "/getContactInfo/" +
                          credentials.apiTokenInstance,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ chatId: incomingChatId }),
                        },
                      );
                      if (infoRes.ok) {
                        const infoJson = (await infoRes.json()) as unknown;
                        if (infoJson && typeof infoJson === "object") {
                          const infoData = infoJson as ContactInfoDto;
                          incomingName =
                            infoData.name || infoData.username || "";
                        }
                      }
                    } catch (e) {
                      console.error("Ошибка загрузки профиля по вебхуку:", e);
                    }
                  }

                  setChats((prevChats: Chat[]) => {
                    if (!prevChats.some((c) => c.chatId === incomingChatId)) {
                      return [
                        { chatId: incomingChatId, name: incomingName },
                        ...prevChats,
                      ];
                    }
                    return prevChats;
                  });

                  if (incomingName) {
                    setCachedNames((prev: StringMap) => {
                      const newNames = {
                        ...prev,
                        [incomingChatId]: incomingName,
                      };
                      localStorage.setItem(
                        "cachedNames",
                        JSON.stringify(newNames),
                      );
                      return newNames;
                    });
                  }

                  if (incomingPhone && incomingPhone !== "0") {
                    setChatNamesMap((prev: StringMap) => {
                      const newMap = {
                        ...prev,
                        [incomingChatId]: incomingPhone,
                      };
                      localStorage.setItem(
                        "chatNamesMap",
                        JSON.stringify(newMap),
                      );
                      return newMap;
                    });
                  }

                  if (
                    activeChat === incomingChatId ||
                    (incomingPhone && activeChat === incomingPhone)
                  ) {
                    setMessages((prev: Message[]) => {
                      if (
                        prev.some((msg) => String(msg.id) === String(uniqueId))
                      )
                        return prev;
                      return [
                        ...prev,
                        {
                          id: uniqueId,
                          text: incomingText,
                          type: "incoming" as const,
                        },
                      ];
                    });
                  }
                }
              }

              await fetch(
                API_URL +
                  "/waInstance" +
                  credentials.idInstance +
                  "/deleteNotification/" +
                  credentials.apiTokenInstance +
                  "/" +
                  data.receiptId,
                { method: "DELETE" },
              );
            }
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "AbortError") break;
          console.error("Ошибка поллинга:", error);
          await new Promise((res) => setTimeout(res, 3000));
        }
      }
    };

    pollMessages();
    return () => {
      isPolling = false;
      controller.abort();
    };
  }, [activeChat, setMessages, setChats, setCachedNames, setChatNamesMap]);
};
