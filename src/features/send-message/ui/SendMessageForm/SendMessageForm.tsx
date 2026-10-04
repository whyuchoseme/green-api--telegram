import { useState } from "react";
import { Button, Input } from "@shared/ui";

import clsx from "clsx";
import styles from "./SendMessageForm.module.scss";

type SendMessageFormProps = {
  className?: string;
  activeChat: string;
  onSendMessage: (text: string) => void;
};

export const SendMessageForm = ({
  className,
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
    <form
      className={clsx(styles["message-input"], className)}
      onSubmit={handleSubmit}
    >
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
