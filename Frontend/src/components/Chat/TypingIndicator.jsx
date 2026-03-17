function TypingIndicator() {
  return (
    <div className="w-full flex justify-start">
      <div className="max-w-[85%] sm:max-w-[75%] flex flex-col gap-1.5">
        <div className="px-1 text-[11px] font-medium uppercase tracking-wide text-t-muted">
          LawGenie
        </div>

        <div className="rounded-2xl px-4 py-3 border border-border inline-flex items-center gap-1.5 bg-bot-bubble text-bot-text">
          {["", "[animation-delay:150ms]", "[animation-delay:300ms]"].map(
            (delayClass, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full animate-pulse bg-typing-dot ${delayClass}`}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
