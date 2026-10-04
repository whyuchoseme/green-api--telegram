import clsx from "clsx";
import styles from "./MessageBubble.module.scss";

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
  timestamp?: number;
};

type MessageBubbleProps = {
  message: Message;
};

const formatTime = (timestamp?: number) => {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <li
      className={clsx(
        styles["message"],
        message.type === "outgoing"
          ? styles["message--outgoing"]
          : styles["message--incoming"],
      )}
    >
      <span className={styles["message__text"]}>{message.text}</span>

      {message.timestamp && (
        <span className={styles["message__time"]}>
          {formatTime(message.timestamp)}
        </span>
      )}
    </li>
  );
};
