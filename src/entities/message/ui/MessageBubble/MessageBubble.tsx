import clsx from "clsx";
import styles from "./MessageBubble.module.scss";

type Message = {
  id: string | number;
  text: string;
  type: "incoming" | "outgoing";
};

type MessageBubbleProps = {
  message: Message;
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
      {message.text}
    </li>
  );
};
