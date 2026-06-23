import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AssetIcon from "../AssetIcon/AssetIcon";
import "./Drawer.css";

export interface DrawerProps {
  /** Controls whether the drawer is open */
  visible: boolean;
  /** Called when the user requests to close (backdrop click, ESC, close button) */
  onClose: () => void;
  /** Drawer content */
  children: React.ReactNode;
  /** Optional title rendered in the header. If omitted, no default header is shown. */
  title?: React.ReactNode;
  /** Optional footer pinned to the bottom of the panel (outside the scroll area). */
  footer?: React.ReactNode;
  /**
   * Width of the panel. Accepts any CSS size value.
   * Defaults to 40% of the viewport (clamped to a sensible min/max).
   */
  width?: string;
  /** Side the drawer slides in from. Defaults to "end" (right). */
  placement?: "start" | "end";
  /** Whether clicking the backdrop closes the drawer. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the drawer. Defaults to true. */
  closeOnEsc?: boolean;
  /** Hide the built-in close (X) button. Defaults to false. */
  hideCloseButton?: boolean;
  /** Extra class name applied to the panel. */
  className?: string;
  /** Extra class name applied to the body (scrollable) area. */
  bodyClassName?: string;
  /** Accessible label for the dialog when no title is provided. */
  ariaLabel?: string;
  testId?: string;
}

const ANIMATION_MS = 300;

export const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  children,
  title,
  footer,
  width = "clamp(360px, 40%, 720px)",
  placement = "end",
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  className = "",
  bodyClassName = "",
  ariaLabel = "Drawer",
  testId = "drawer",
}) => {
  // Keep the drawer mounted during the exit animation.
  const [mounted, setMounted] = useState(visible);
  // Drives the open/closed CSS transition.
  const [animateOpen, setAnimateOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setMounted(true);
      // Next frame: flip to the open state so the transition runs.
      const raf = requestAnimationFrame(() => setAnimateOpen(true));
      return () => cancelAnimationFrame(raf);
    }

    setAnimateOpen(false);
    closeTimer.current = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [visible]);

  // Close on Escape.
  useEffect(() => {
    if (!visible || !closeOnEsc) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, closeOnEsc, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`v2-drawer-root ${animateOpen ? "v2-drawer-open" : ""}`}
      data-testid={testId}
    >
      <div
        className="v2-drawer-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={`v2-drawer-panel v2-drawer-${placement} ${className}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : ariaLabel}
      >
        {(title || !hideCloseButton) && (
          <div className="v2-drawer-header">
            {title ? <div className="v2-drawer-title">{title}</div> : <span />}
            {!hideCloseButton && (
              <button
                type="button"
                className="v2-drawer-close"
                onClick={onClose}
                aria-label="Close"
                data-testid={`${testId}-close`}
              >
                <AssetIcon name="close-button" size={16} color="#5B6168" />
              </button>
            )}
          </div>
        )}
        <div className={`v2-drawer-body ${bodyClassName}`}>{children}</div>
        {footer && <div className="v2-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
