const formatTime = (time) => {
  if (!time) return "";

  const date = time instanceof Date ? time : new Date(time);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function ChatBubble({ role, text, createdAt, files = [] }) {
  const isUser = role === "user";

  return (
    <article
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1.5`}
      >
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-t-muted">
            {isUser ? "You" : "LawGenie"}
          </span>
          <span className="text-[11px] text-t-disabled">
            {formatTime(createdAt)}
          </span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere border ${
            isUser
              ? "bg-user-bubble text-user-text border-transparent"
              : "bg-bot-bubble text-bot-text border-border"
          }`}
        >
          {text}

          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <span
                  key={`${file.name}-${file.size}-${index}`}
                  className="inline-flex max-w-full items-center rounded-md px-2 py-1 text-xs border border-accent-700 text-accent-700 break-all"
                >
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ChatBubble;
