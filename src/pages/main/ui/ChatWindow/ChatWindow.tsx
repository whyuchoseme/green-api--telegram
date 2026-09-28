import { useEffect, useRef } from "react";

import { Spinner } from "@shared/ui";
import { MessageBubble } from "@entities/message";
import { SendMessageForm } from "@features/send-message";

import clsx from "clsx";
import styles from "./ChatWindow.module.scss";

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

type ChatWindowProps = {
  activeChat: string;
  chats: Chat[];
  messages: Message[];
  isHistoryLoading: boolean;
  cachedNames: StringMap;
  chatNamesMap: StringMap;
  onSendMessage: (text: string) => void;
};

export const ChatWindow = ({
  activeChat,
  chats,
  messages,
  isHistoryLoading,
  cachedNames,
  chatNamesMap,
  onSendMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const currentChatName =
    chats.find((c: Chat) => c.chatId === activeChat)?.name ||
    cachedNames[activeChat] ||
    chatNamesMap[activeChat] ||
    activeChat;

  return (
    <section className={styles["chat-window"]}>
      <div className={styles["chat-window__header"]}>
        <div className={styles["chat-window__person-avatar"]}>
          {currentChatName ? currentChatName.charAt(0).toUpperCase() : "A"}
        </div>
        <div className={styles["chat-window__person-info"]}>
          <div className={styles["chat-window__person-name"]}>
            Чат: {currentChatName}
          </div>
        </div>
      </div>

      <ul className={clsx(styles["messages-list"], "no-scrollbar")}>
        {isHistoryLoading ? (
          <Spinner />
        ) : (
          <>
            {messages.map((msg: Message) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <li ref={messagesEndRef} aria-hidden="true" />
          </>
        )}
      </ul>

      <SendMessageForm activeChat={activeChat} onSendMessage={onSendMessage} />
    </section>
  );
};
