import { useLayoutEffect, useRef, useState } from "react";
import InputChatBox from "@/components/Chat/InputChatBox";
import ChatScrollWindow from "../components/Chat/ChatScrollWindow";
import chatService from "@/services/chatService";

const createMessage = ({ role, text, files = [] }) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  text,
  files,
  createdAt: new Date(),
});

const initialMessages = [
  createMessage({
    role: "assistant",
    text: "Hello! I am LawGenie. Ask me about Indian laws, legal procedures, or upload documents to continue.",
  }),
];

function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const pageRef = useRef(null);
  const pageBottomRef = useRef(null);

  const scrollToBottom = (behavior = "auto") => {
    const scrollBehavior = behavior === "smooth" ? "smooth" : "auto";
    const page = pageRef.current;
    const pageBottom = pageBottomRef.current;

    if (page) {
      page.scrollTo({
        top: page.scrollHeight,
        behavior: scrollBehavior,
      });
    }

    if (pageBottom) {
      pageBottom.scrollIntoView({ block: "end", behavior: scrollBehavior });
    }
  };

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      scrollToBottom("auto");
    });

    return () => cancelAnimationFrame(id);
  }, [messages, isTyping]);

  const handleSend = async ({ message, files }) => {
    if (isTyping) return;

    const userMessage = createMessage({ role: "user", text: message, files });

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    scrollToBottom();

    try {
      const reply = await chatService.sendMessage({ message, files });

      setMessages((prev) => [
        ...prev,
        createMessage({ role: "assistant", text: reply }),
      ]);
      scrollToBottom();
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  return (
    <div
      ref={pageRef}
      className="relative h-full min-h-0 bg-bg text-t-primary px-4 py-4 sm:px-6 sm:py-6"
    >
      <section className="mx-auto min-h-full max-w-5xl rounded-2xl border border-border shadow-sm flex backdrop-blur-lg flex-col bg-surface">
        <header className="px-5 py-4 border-b border-border bg-surface overflow-hidden rounded-t-2xl">
          <p className="text-sm font-medium text-t-primary">LawGenie Chat</p>
          <p className="text-xs mt-1 text-t-muted">
            Professional legal assistant for Indian law research and document
            understanding.
          </p>
        </header>

        <ChatScrollWindow messages={messages} isTyping={isTyping} />

        <InputChatBox onSend={handleSend} loading={isTyping} />
      </section>

      <div ref={pageBottomRef} className="h-px" aria-hidden="true" />
    </div>
  );
}

export default ChatPage;
