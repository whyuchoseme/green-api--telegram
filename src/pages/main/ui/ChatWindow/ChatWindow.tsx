import { useEffect, useRef } from "react";
import { Button, Container, Spinner } from "@shared/ui";
import { MessageBubble } from "@entities/message";
import { SendMessageForm } from "@features/send-message";

import arrowBack from "@shared/assets/icons/back-button.svg";

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
  className?: string;
  activeChat: string;
  chats: Chat[];
  messages: Message[];
  isHistoryLoading: boolean;
  cachedNames: StringMap;
  chatNamesMap: StringMap;
  onSendMessage: (text: string) => void;
  onBack: () => void;
};

export const ChatWindow = ({
  className,
  activeChat,
  chats,
  messages,
  isHistoryLoading,
  cachedNames,
  chatNamesMap,
  onSendMessage,
  onBack,
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
    <section className={clsx(styles["chat-window"], className)}>
      <Container viewVariant="stretch">
        <div className={styles["chat-window__inner"]}>
          <div className={styles["chat-window__header"]}>
            <Button
              className={clsx(
                styles["chat-window__back-button"],
                "visible-mobile",
              )}
              viewVariant="back"
              onClick={onBack}
              aria-label="Назад к списку чатов"
            >
              <img
                src={arrowBack}
                alt=""
                width="25"
                height="25"
                loading="lazy"
              />
            </Button>
            <div className={styles["chat-window__person-avatar"]}>
              {currentChatName ? currentChatName.charAt(0).toUpperCase() : "?"}
            </div>
            <div className={styles["chat-window__person-info"]}>
              <div className={styles["chat-window__person-name"]}>
                {currentChatName}
              </div>
            </div>
          </div>

          <ul className={clsx(styles["chat-window__messages"], "no-scrollbar")}>
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

          <SendMessageForm
            className={styles["chat-window__input-area"]}
            activeChat={activeChat}
            onSendMessage={onSendMessage}
          />
        </div>
      </Container>
    </section>
  );
};
