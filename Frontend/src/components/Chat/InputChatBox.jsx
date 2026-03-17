import { useRef, useState, useEffect, useCallback } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_FILES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

const ACCEPT_ATTRIBUTE = ".pdf,.txt,.csv,.doc,.docx";

const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

function InputChatBox({ onSend, loading = false, disabled = false }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const canSend =
    !loading && !disabled && (message.trim().length > 0 || files.length > 0);
  const isLocked = loading || disabled;

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [message, resizeTextarea]);

  const validateFiles = (incoming) => {
    const valid = [];
    let err = "";

    for (const file of incoming) {
      if (!ALLOWED_TYPES.has(file.type)) {
        err = "Unsupported file type.";
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        err = `File exceeds ${formatFileSize(MAX_FILE_SIZE)}.`;
        continue;
      }

      valid.push(file);
    }

    if (files.length + valid.length > MAX_FILES) {
      err = `Maximum ${MAX_FILES} files allowed.`;
    }

    return { valid, err };
  };

  const addFiles = (incoming) => {
    if (!incoming?.length) return;

    const arr = Array.from(incoming);
    const { valid, err } = validateFiles(arr);

    if (err) setError(err);
    else setError("");

    setFiles((prev) => {
      const merged = [...prev, ...valid];

      const unique = merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified,
          ),
      );

      return unique.slice(0, MAX_FILES);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (disabled) return;

    const dropped = e.dataTransfer.files;
    if (dropped?.length) addFiles(dropped);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const pasted = [];

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) pasted.push(file);
      }
    }

    if (pasted.length) addFiles(pasted);
  };

  const onSubmit = async () => {
    if (!canSend || isLocked) return;

    const text = message.trim();

    try {
      await onSend?.({
        message: text,
        files,
      });

      setMessage("");
      setFiles([]);
      setError("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } catch {
      setError("Failed to send message.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (canSend) onSubmit();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="border-t border-border px-4 py-4 relative w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto">
        <div
          className={`rounded-2xl border transition bg-surface ${
            dragActive ? "border-primary" : "border-border"
          }`}
        >
          {files.length > 0 && (
            <div className="px-3 pt-3 pb-1">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-t-secondary">
                  {files.length}/{MAX_FILES} files selected
                </p>
                <button
                  type="button"
                  onClick={clearFiles}
                  disabled={isLocked}
                  className="text-xs text-t-muted hover:text-t-primary transition"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs max-w-60 bg-surface-elevated border border-border"
                  >
                    <PaperClipIcon className="w-3.5 h-3.5 shrink-0 text-t-muted" />
                    <span className="truncate text-t-primary" title={file.name}>
                      {file.name}
                    </span>

                    <span className="text-t-secondary shrink-0">
                      {formatFileSize(file.size)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isLocked}
                      className="opacity-60 hover:opacity-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={`Remove ${file.name}`}
                    >
                      <XMarkIcon className="w-3.5 h-3.5 text-t-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            maxLength={MAX_MESSAGE_LENGTH}
            rows={1}
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLocked}
            enterKeyHint="send"
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask LawGenie about Indian laws..."
            className={`w-full resize-none px-3 ${
              files.length ? "pt-2 pb-3" : "py-3"
            } outline-none text-sm bg-transparent text-t-primary placeholder:text-t-muted`}
          />

          <div className="flex items-center justify-between px-2 pb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLocked || files.length >= MAX_FILES}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition text-sm ${
                files.length > 0
                  ? "text-primary bg-primary-100"
                  : "text-t-secondary hover:bg-surface-elevated"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <PaperClipIcon className="w-4 h-4" />
              {files.length >= MAX_FILES ? "Limit reached" : "Attach"}
            </button>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${
                  message.length > 1800 ? "text-error" : "text-t-secondary"
                }`}
              >
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>

              <button
                type="submit"
                disabled={!canSend}
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition ${
                  canSend ? "hover:scale-105" : "opacity-40"
                } bg-primary text-white`}
                aria-label="Send message"
              >
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="px-3 pb-2 text-[11px] text-t-muted">
            Supports PDF, TXT, CSV, DOC, DOCX · Max {MAX_FILES} files ·{" "}
            {formatFileSize(MAX_FILE_SIZE)} each
          </div>
        </div>

        {error && <div className="text-xs mt-2 text-error">{error}</div>}

        <input
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </form>
    </div>
  );
}

export default InputChatBox;
