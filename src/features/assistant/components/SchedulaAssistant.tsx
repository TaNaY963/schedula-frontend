"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { scrollToElement } from "@/lib/scroll";

import { getAssistantConfig } from "../config";
import { useWelcomeBubble } from "../hooks/use-welcome-bubble";
import { getVisibleMenuOptions, matchIntent } from "../utils/keyword-matcher";
import { PUBLIC_LANDING_MENU_IDS } from "../utils/menu-icons";
import { useAssistantMode } from "../utils/use-assistant-mode";
import AssistantFab from "./AssistantFab";
import AssistantInput from "./AssistantInput";
import AssistantMessage from "./AssistantMessage";
import AssistantQuickActions from "./AssistantQuickActions";
import AssistantWelcomeBubble from "./AssistantWelcomeBubble";

import type {
  AssistantAction,
  AssistantIntent,
  ChatMessage,
} from "../types";

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function intentToMenuAction(intent: AssistantIntent): AssistantAction {
  return {
    id: `menu-${intent.id}`,
    label: intent.label,
    type: "intent",
    intentId: intent.id,
  };
}

export default function SchedulaAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const mode = useAssistantMode();
  const config = useMemo(() => getAssistantConfig(mode), [mode]);
  const menuOptions = useMemo(
    () => getVisibleMenuOptions(config.menuOptions),
    [config.menuOptions],
  );

  const isLandingPage = pathname === "/";
  const isPublicLanding = mode === "public" && isLandingPage;
  const { isVisible: showWelcomeBubble, dismiss: dismissWelcomeBubble } =
    useWelcomeBubble(isPublicLanding);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: createMessageId(),
        role: "assistant",
        content: config.initialMessage,
      },
    ]);
    setShowMenu(true);
  }, [config.initialMessage]);

  useEffect(() => {
    resetConversation();
  }, [mode, resetConversation]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, showMenu]);

  const openAssistant = useCallback(() => {
    dismissWelcomeBubble();
    setIsOpen(true);
  }, [dismissWelcomeBubble]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    if (isOpen) {
      closeAssistant();
      return;
    }

    openAssistant();
  }, [closeAssistant, isOpen, openAssistant]);

  const respondToIntent = useCallback(
    (intent: AssistantIntent, userLabel?: string) => {
      if (userLabel) {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "user",
            content: userLabel,
          },
        ]);
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: intent.response,
          actions: intent.actions,
        },
      ]);
      setShowMenu(false);
    },
    [],
  );

  const handleIntentById = useCallback(
    (intentId: string, userLabel?: string) => {
      const intent = config.menuOptions.find((item) => item.id === intentId);

      if (intent) {
        respondToIntent(intent, userLabel);
      }
    },
    [config.menuOptions, respondToIntent],
  );

  const handleAction = useCallback(
    (action: AssistantAction) => {
      if (action.type === "intent" && action.intentId) {
        handleIntentById(action.intentId, action.label);
        return;
      }

      if (action.type === "navigate" && action.href) {
        closeAssistant();
        router.push(action.href);
        return;
      }

      if (action.type === "scroll" && action.scrollTarget) {
        closeAssistant();

        const scrollTarget = action.scrollTarget;
        const isOnLanding = window.location.pathname === "/";

        if (isOnLanding) {
          scrollToElement(scrollTarget);
          return;
        }

        router.push("/");
        window.setTimeout(() => {
          scrollToElement(scrollTarget);
        }, 300);
      }
    },
    [closeAssistant, handleIntentById, router],
  );

  const handleUserInput = useCallback(
    (input: string) => {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "user",
          content: input,
        },
      ]);

      const matchedIntent = matchIntent(input, config.menuOptions);

      if (matchedIntent) {
        respondToIntent(matchedIntent);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: config.fallbackMessage,
        },
      ]);
      setShowMenu(true);
    },
    [config, respondToIntent],
  );

  const visibleMenuActions = useMemo(() => {
    const allActions = menuOptions.map(intentToMenuAction);

    if (!isPublicLanding) {
      return allActions;
    }

    return allActions.filter((action) =>
      PUBLIC_LANDING_MENU_IDS.includes(
        action.intentId as (typeof PUBLIC_LANDING_MENU_IDS)[number],
      ),
    );
  }, [isPublicLanding, menuOptions]);

  const showPublicSubtitle =
    isPublicLanding && showMenu && messages.length === 1;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 sm:bg-transparent"
          aria-hidden="true"
          onClick={closeAssistant}
        />
      )}

      <div
        className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      >
        {isOpen && (
          <div
            className="assistant-slide-up pointer-events-auto flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-md)] sm:w-[24rem] md:max-h-[min(85vh,36rem)]"
            role="dialog"
            aria-label="Schedula Assistant"
          >
            <header className="relative overflow-hidden border-b border-[var(--line)] bg-gradient-to-r from-[var(--brand)] to-[var(--brand-deep)] px-4 py-4 text-white">
              <div
                className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-white/10"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-bold shadow-[var(--shadow-brand)] ring-1 ring-white/20">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      Schedula Assistant
                    </p>
                    <p className="text-xs text-white/80">Here to help</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAssistant}
                  className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
                  aria-label="Close assistant"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            <div className="flex max-h-[min(70vh,32rem)] flex-col bg-gradient-to-b from-[#f8fbff] to-[#f3f8fd] md:max-h-[min(60vh,28rem)]">
              <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4 sm:px-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2.5">
                    <AssistantMessage message={message} />
                    {message.actions && message.actions.length > 0 && (
                      <AssistantQuickActions
                        actions={message.actions}
                        onAction={handleAction}
                      />
                    )}
                  </div>
                ))}

                {showPublicSubtitle && (
                  <p className="px-1 text-xs leading-relaxed text-[var(--muted)]">
                    Find a doctor, learn how booking works, or get help with
                    Schedula.
                  </p>
                )}

                {showMenu && (
                  <AssistantQuickActions
                    actions={visibleMenuActions}
                    onAction={handleAction}
                    variant="menu"
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              <AssistantInput onSend={handleUserInput} />
            </div>
          </div>
        )}

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          {!isOpen && showWelcomeBubble && (
            <AssistantWelcomeBubble
              onOpen={openAssistant}
              onDismiss={dismissWelcomeBubble}
            />
          )}

          <AssistantFab
            isOpen={isOpen}
            showPulse={showWelcomeBubble}
            onClick={toggleAssistant}
          />
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
