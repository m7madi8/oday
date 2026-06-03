"use client";

import { GALLERY_CATEGORY_ANCHORS } from "@/lib/gallery-anchors";
import { services } from "@/lib/content/services";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const DRAWER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type ServicesDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ServicesDrawer({ isOpen, onClose }: ServicesDrawerProps) {
  const [subOpen, setSubOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSubOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function closeAll() {
    setSubOpen(false);
    onClose();
  }

  function closeSubDrawer() {
    setSubOpen(false);
  }

  function handleCategoryNavigate() {
    setSubOpen(false);
    onClose();
  }

  function handleServiceClick(title: string) {
    if (title === "Exterior Design") {
      setSubOpen(true);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`svc-drawer-shell fixed inset-0 z-[580]${isOpen ? " svc-drawer-shell--open" : ""}`}
      aria-hidden={!isOpen}
      onClick={isOpen ? closeAll : undefined}
    >
      <div
        aria-hidden
        className={`svc-drawer__overlay fixed inset-0 z-40${isOpen ? " svc-drawer__overlay--open" : ""}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Our Services"
        className="svc-drawer fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[92vw] flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: `transform 550ms ${DRAWER_EASE}`,
        }}
      >
        <header className="svc-drawer__header relative shrink-0 px-7 pb-5 pt-8">
          <button
            type="button"
            data-no-glow
            aria-label="Close drawer"
            className="svc-drawer__close absolute right-5 top-6 flex h-9 w-9 items-center justify-center"
            onClick={closeAll}
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>

          <p className="svc-drawer__eyebrow">Navigation</p>
          <h2 className="svc-drawer__title mt-3 pr-10">Our Services</h2>
        </header>

        <ul className="min-h-0 flex-1 overflow-y-auto px-7">
          {services.map((service) => (
            <li key={service.slug}>
              <button
                type="button"
                data-no-glow
                className="svc-drawer__service group flex w-full items-center gap-4 border-b py-5 text-left"
                onClick={() => handleServiceClick(service.title)}
              >
                <span className="svc-drawer__service-num w-7 shrink-0 tabular-nums">
                  {service.orderLabel}
                </span>
                <span className="svc-drawer__service-name min-w-0 flex-1">{service.title}</span>
                <ChevronRight
                  className="svc-drawer__service-chevron h-4 w-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>

        <footer className="svc-drawer__footer shrink-0 border-t px-7 py-5">
          <p className="svc-drawer__footer-copy">OD Studio — Oday Abu Doha</p>
        </footer>

        <aside
          aria-label="Exterior Design categories"
          className="svc-drawer__sub absolute right-0 top-0 z-10 flex h-full w-[280px] max-w-full flex-col overflow-hidden"
          style={{
            transform: subOpen ? "translateX(0)" : "translateX(100%)",
            transition: `transform 500ms ${DRAWER_EASE}`,
            transitionDelay: subOpen ? "80ms" : "0ms",
          }}
        >
          <header className="svc-drawer__sub-header shrink-0 px-6 pb-5 pt-8">
            <button
              type="button"
              data-no-glow
              className="svc-drawer__back group mb-6 flex items-center gap-1.5"
              onClick={closeSubDrawer}
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              <span className="svc-drawer__back-label">Services</span>
            </button>

            <p className="svc-drawer__eyebrow svc-drawer__eyebrow--muted">Category</p>
            <h3 className="svc-drawer__sub-title mt-3 italic">Exterior Design</h3>
          </header>

          <ul className="min-h-0 flex-1 overflow-y-auto px-6">
            {GALLERY_CATEGORY_ANCHORS.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/gallery#${category.id}`}
                  className="svc-drawer__category group flex items-center gap-3 border-b py-4"
                  onClick={handleCategoryNavigate}
                >
                  <span className="svc-drawer__category-num w-6 shrink-0 tabular-nums">
                    {category.order}
                  </span>
                  <span className="svc-drawer__category-name min-w-0 flex-1">{category.label}</span>
                  <span className="svc-drawer__category-tag shrink-0 uppercase">Gallery</span>
                  <ArrowUpRight
                    className="svc-drawer__category-arrow h-3.5 w-3.5 shrink-0 opacity-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </aside>
    </div>,
    document.body,
  );
}
