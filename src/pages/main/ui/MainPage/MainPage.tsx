import { useState } from "react";
import { useChats } from "@entities/chat";
import { useMessages } from "@entities/message";
import { useCreateChat } from "@features/create-chat";
import { useSendMessage } from "@features/send-message";
import { useMessagePolling } from "@features/receive-messages";
import { Container } from "@shared/ui";
import { Sidebar } from "../Sidebar";
import { ChatWindow } from "../ChatWindow";

import clsx from "clsx";
import styles from "./MainPage.module.scss";

export const MainPage = () => {
  const {
    chats,
    setChats,
    activeChat,
    chatNamesMap,
    setChatNamesMap,
    cachedNames,
    setCachedNames,
    isChatsLoading,
    handleSelectChat,
  } = useChats();

  const { messages, setMessages, isHistoryLoading } = useMessages(activeChat);

  const [closedChatId, setClosedChatId] = useState<string | null>(null);
  const isMobileChatOpen = !!activeChat && activeChat !== closedChatId;

  const onChatSelect = (chatId: string) => {
    handleSelectChat(chatId);
    setClosedChatId(null);
  };

  const { handleCreateChat } = useCreateChat({
    setChats,
    setChatNamesMap,
    setCachedNames,
    handleSelectChat: onChatSelect,
  });

  const { handleSendMessage } = useSendMessage({ activeChat, setMessages });

  useMessagePolling({
    activeChat,
    setMessages,
    setChats,
    setCachedNames,
    setChatNamesMap,
  });

  const handleLogout = () => {
    localStorage.removeItem("idInstance");
    localStorage.removeItem("apiTokenInstance");
    localStorage.removeItem("lastChat");
    window.location.reload();
  };

  return (
    <div className={styles["main-page"]}>
      <Sidebar
        className={styles["main-page__sidebar"]}
        chats={chats}
        activeChat={activeChat}
        isChatsLoading={isChatsLoading}
        cachedNames={cachedNames}
        chatNamesMap={chatNamesMap}
        onSelectChat={onChatSelect}
        onCreateChat={handleCreateChat}
        onLogout={handleLogout}
        isChatSelected={isMobileChatOpen}
      />

      {!activeChat ? (
        <section
          className={clsx(
            styles["main-page__empty-chat"],
            "empty-chat",
            "hidden-mobile",
          )}
        >
          <Container>
            <p className={styles["main-page__hint"]}>
              Выберите чат слева или добавьте новый по номеру/ID
            </p>
          </Container>
        </section>
      ) : (
        <ChatWindow
          className={!isMobileChatOpen ? "hidden-mobile" : undefined}
          activeChat={activeChat}
          chats={chats}
          messages={messages}
          isHistoryLoading={isHistoryLoading}
          cachedNames={cachedNames}
          chatNamesMap={chatNamesMap}
          onSendMessage={handleSendMessage}
          onBack={() => setClosedChatId(activeChat)}
        />
      )}
    </div>
  );
};
