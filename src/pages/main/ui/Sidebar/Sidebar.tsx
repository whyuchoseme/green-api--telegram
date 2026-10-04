import { useState } from "react";
import { Button, Spinner } from "@shared/ui";
import { CreateChatForm } from "@features/create-chat";
import { ChatItem } from "@entities/chat";

import clsx from "clsx";
import styles from "./Sidebar.module.scss";

type Chat = {
  chatId: string;
  name: string;
};

type StringMap = {
  [key: string]: string;
};

type SidebarProps = {
  className?: string;
  chats: Chat[];
  activeChat: string;
  isChatsLoading: boolean;
  cachedNames: StringMap;
  chatNamesMap: StringMap;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (phoneNumber: string) => Promise<string>;
  onLogout: () => void;
  isChatSelected: boolean;
};

export const Sidebar = ({
  className,
  chats,
  activeChat,
  isChatsLoading,
  cachedNames,
  chatNamesMap,
  onSelectChat,
  onCreateChat,
  onLogout,
  isChatSelected,
}: SidebarProps) => {
  const [searchError, setSearchError] = useState("");

  const handleAddChat = async (phoneNumber: string) => {
    const errorMsg = await onCreateChat(phoneNumber);

    if (errorMsg) {
      setSearchError(errorMsg);
      return false;
    } else {
      setSearchError("");
      return true;
    }
  };

  return (
    <aside
      className={clsx(
        styles["sidebar"],
        isChatSelected && "hidden-mobile",
        className,
      )}
    >
      <div className={styles["sidebar__header"]}>
        <Button viewVariant="danger" onClick={onLogout}>
          Выйти
        </Button>
      </div>

      <CreateChatForm
        addChat={handleAddChat}
        error={searchError}
        onClearError={() => setSearchError("")}
      />

      <ul className={styles["sidebar__chats-list"]}>
        {isChatsLoading ? (
          <Spinner />
        ) : (
          chats.map((chat: Chat) => (
            <li key={chat.chatId}>
              <ChatItem
                name={
                  chat.name ||
                  cachedNames[chat.chatId] ||
                  chatNamesMap[chat.chatId] ||
                  chat.chatId
                }
                isActive={activeChat === chat.chatId}
                onClick={() => onSelectChat(chat.chatId)}
              />
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};
