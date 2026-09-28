import { useState } from "react";
import { Button, Input } from "@shared/ui";

import styles from "./CreateChatForm.module.scss";

type CreateChatFormProps = {
  addChat: (chatId: string) => Promise<boolean>;
  error?: string;
  onClearError?: () => void;
};

export const CreateChatForm = ({
  addChat,
  error,
  onClearError,
}: CreateChatFormProps) => {
  const [newChatInput, setNewChatInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;

    const isSuccess = await addChat(newChatInput);
    if (isSuccess) {
      setNewChatInput("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatInput(e.target.value);
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <form className={styles["create-chat-form"]} onSubmit={handleSubmit}>
      <Input
        id="phone-input"
        className={styles["create-chat-input"]}
        type="text"
        placeholder="Номер телефона РФ/РК"
        value={newChatInput}
        error={error}
        onChange={handleChange}
      />
      <Button viewVariant="accent" type="submit">
        +
      </Button>
    </form>
  );
};
