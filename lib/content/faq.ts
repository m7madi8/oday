export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "faq1",
    question: "What project types are the best fit for your team?",
    answer:
      "Luxury residences and villas, cultural destinations, and landscape-led estates where interior, exterior, and outdoor design quality are critical.",
  },
  {
    id: "faq2",
    question: "How fast can we move from brief to concept?",
    answer:
      "Most concept phases run within 4-8 weeks, followed by structured technical delivery according to scope and authority requirements.",
  },
  {
    id: "faq3",
    question: "How do you control budget and quality together?",
    answer:
      "Through stage-gated approvals, BIM coordination, and weekly QA/QC reviews that lock quality while managing change early.",
  },
  {
    id: "faq4",
    question: "Can you support investor or sales presentations?",
    answer:
      "Yes. We prepare high-impact visual and strategic presentation assets for investors, boards, and pre-sales teams.",
  },
];
