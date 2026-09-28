import { Sidebar } from "../Sidebar";
import { ChatWindow } from "../ChatWindow";

import { useChats } from "@entities/chat";
import { useMessages } from "@entities/message";

import { useCreateChat } from "@features/create-chat";
import { useSendMessage } from "@features/send-message";
import { useMessagePolling } from "@features/receive-messages";
import { Container } from "@shared/ui";

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

  const { handleCreateChat } = useCreateChat({
    setChats,
    setChatNamesMap,
    setCachedNames,
    handleSelectChat,
  });

  const { handleSendMessage } = useSendMessage({
    activeChat,
    setMessages,
  });

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
        chats={chats}
        activeChat={activeChat}
        isChatsLoading={isChatsLoading}
        cachedNames={cachedNames}
        chatNamesMap={chatNamesMap}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onLogout={handleLogout}
      />

      {!activeChat ? (
        <section className={styles["empty-chat"]}>
          <Container>
            <p className={styles["empty-chat__text"]}>
              Выберите чат слева или добавьте новый по номеру/ID
            </p>
          </Container>
        </section>
      ) : (
        <ChatWindow
          activeChat={activeChat}
          chats={chats}
          messages={messages}
          isHistoryLoading={isHistoryLoading}
          cachedNames={cachedNames}
          chatNamesMap={chatNamesMap}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};
