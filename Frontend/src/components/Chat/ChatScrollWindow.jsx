import ChatBubble from "@/components/Chat/ChatBubble";
import TypingIndicator from "@/components/Chat/TypingIndicator";

function ChatScrollWindow({ messages, isTyping }) {
  return (
    <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5 bg-bg">
      <div
        className="mx-auto max-w-4xl space-y-4"
        aria-live="polite"
        role="log"
        aria-relevant="additions text"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            role={message.role}
            text={message.text}
            createdAt={message.createdAt}
            files={message.files}
          />
        ))}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

export default ChatScrollWindow;
