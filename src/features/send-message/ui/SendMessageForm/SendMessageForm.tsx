import { useState } from "react";
import { Button, Input } from "@shared/ui";

import styles from "./SendMessageForm.module.scss";

type SendMessageFormProps = {
  activeChat: string;
  onSendMessage: (text: string) => void;
};

export const SendMessageForm = ({
  activeChat,
  onSendMessage,
}: SendMessageFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;

    onSendMessage(text);
    setText("");
  };

  return (
    <form className={styles["message-input"]} onSubmit={handleSubmit}>
      <Input
        id="message-input"
        className={styles["message-input__input"]}
        type="text"
        placeholder="Сообщение"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button viewVariant="secondary" type="submit">
        Отправить
      </Button>
    </form>
  );
};
