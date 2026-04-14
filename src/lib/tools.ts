import Type from "~icons/lucide/type";
import BarChart from "~icons/lucide/bar-chart";
import Link from "~icons/lucide/link";
import Lock from "~icons/lucide/lock";
import FileText from "~icons/lucide/file-text";
import ScrollText from "~icons/lucide/scroll-text";
import Search from "~icons/lucide/search";
import ListOrdered from "~icons/lucide/list-ordered";
import FileJson from "~icons/lucide/file-json";
import IdCard from "~icons/lucide/id-card";
import Ticket from "~icons/lucide/ticket";
import Clock from "~icons/lucide/clock";
import FileCode from "~icons/lucide/file-code";
import Palette from "~icons/lucide/palette";
import QrCode from "~icons/lucide/qr-code";
import Scale from "~icons/lucide/scale";
import FileEdit from "~icons/lucide/file-edit";
import Key from "~icons/lucide/key";
import Timer from "~icons/lucide/timer";
import ListTodo from "~icons/lucide/list-todo";

export type ToolEntry = {
  name: string;
  description: string;
  icon: any;
  path: string;
};

export type ToolCategory = {
  id: string;
  title: string;
  description: string;
  tools: ToolEntry[];
};

export const toolCategories: ToolCategory[] = [
  {
    id: "string",
    title: "String Tools",
    description: "Text manipulation and analysis tools to help you work with strings efficiently.",
    tools: [
      {
        name: "Text Case Converter",
        description:
          "Convert text between different cases — uppercase, lowercase, title case, sentence case, and more.",
        icon: Type,
        path: "/tools/text-case-converter"
      },
      {
        name: "Text Counter",
        description: "Count characters, words, lines, and paragraphs in your text instantly.",
        icon: BarChart,
        path: "/tools/text-counter"
      },
      {
        name: "URL Encoder/Decoder",
        description: "Encode and decode URLs safely for web applications and APIs.",
        icon: Link,
        path: "/tools/url-encoder-decoder"
      },
      {
        name: "Base64 Encoder/Decoder",
        description: "Encode and decode text to and from Base64 format.",
        icon: Lock,
        path: "/tools/base64-encoder-decoder"
      },
      {
        name: "Text Diff Checker",
        description: "Compare two texts and highlight the differences between them.",
        icon: FileText,
        path: "/tools/text-diff-checker"
      },
      {
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text for your designs and mockups.",
        icon: ScrollText,
        path: "/tools/lorem-ipsum-generator"
      },
      {
        name: "Find and Replace",
        description: "Find and replace text patterns with support for regex.",
        icon: Search,
        path: "/tools/find-replace"
      },
      {
        name: "Text Sorter",
        description: "Sort text lines alphabetically, numerically, or by length.",
        icon: ListOrdered,
        path: "/tools/text-sorter"
      }
    ]
  },
  {
    id: "developer",
    title: "Developer Tools",
    description: "Format data, inspect tokens, and generate identifiers — all in your browser.",
    tools: [
      {
        name: "JSON Formatter",
        description: "Validate, prettify, or minify JSON with clear error messages.",
        icon: FileJson,
        path: "/tools/json-formatter"
      },
      {
        name: "JWT Decoder",
        description: "Decode JWT header and payload to JSON (signature is not verified).",
        icon: IdCard,
        path: "/tools/jwt-decoder"
      },
      {
        name: "UUID Generator",
        description: "Generate random UUID v4 identifiers and copy them in one click.",
        icon: Ticket,
        path: "/tools/uuid-generator"
      }
    ]
  },
  {
    id: "date-time",
    title: "Date & Time",
    description: "Convert between Unix time and human-readable dates in local and UTC.",
    tools: [
      {
        name: "Unix Timestamp Converter",
        description: "Convert epoch seconds or milliseconds to dates and back.",
        icon: Clock,
        path: "/tools/unix-timestamp-converter"
      }
    ]
  },
  {
    id: "encoding",
    title: "Encoding & Data",
    description: "Encode and decode structured text alongside your URL and Base64 workflows.",
    tools: [
      {
        name: "HTML Entity Encoder/Decoder",
        description: "Escape or unescape HTML entities for safe markup and content.",
        icon: FileCode,
        path: "/tools/html-entity-encoder-decoder"
      }
    ]
  },
  {
    id: "color",
    title: "Colors & Accessibility",
    description: "Check contrast and keep palettes accessible for interfaces and content.",
    tools: [
      {
        name: "Color Contrast Checker",
        description: "Compute WCAG contrast ratio between two colors and see pass levels.",
        icon: Palette,
        path: "/tools/color-contrast-checker"
      }
    ]
  },
  {
    id: "qr",
    title: "QR & Barcodes",
    description: "Create scannable codes from text or URLs without sending data to a server.",
    tools: [
      {
        name: "QR Code Generator",
        description: "Turn any text or link into a QR code image you can download.",
        icon: QrCode,
        path: "/tools/qr-code-generator"
      }
    ]
  },
  {
    id: "calculators",
    title: "Calculators & Converters",
    description: "Quick number work for everyday measurements and conversions.",
    tools: [
      {
        name: "Unit Converter",
        description: "Convert temperature, length, and mass with common engineering units.",
        icon: Scale,
        path: "/tools/unit-converter"
      }
    ]
  },
  {
    id: "writing",
    title: "Writing & SEO",
    description: "Shape titles and URLs for publishing and search-friendly content.",
    tools: [
      {
        name: "Slug Generator",
        description: "Turn headings or phrases into URL-safe slugs.",
        icon: FileEdit,
        path: "/tools/slug-generator"
      }
    ]
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Generate secrets locally — nothing is uploaded or stored.",
    tools: [
      {
        name: "Password Generator",
        description: "Create strong random passwords with adjustable length and character sets.",
        icon: Key,
        path: "/tools/password-generator"
      }
    ]
  },
  {
    id: "productivity",
    title: "Productivity",
    description: "Focus and time management tools to boost your efficiency.",
    tools: [
      {
        name: "Pomodoro Timer",
        description:
          "Boost productivity with timed work sessions and breaks using the Pomodoro technique.",
        icon: Timer,
        path: "/tools/pomodoro-timer"
      },
      {
        name: "To-Do List",
        description: "Simple and effective to-do list for tracking your tasks with local storage.",
        icon: ListTodo,
        path: "/tools/todo-list"
      },
      {
        name: "Pros & Cons List",
        description:
          "Make balanced decisions by weighing the advantages and disadvantages of your options.",
        icon: Scale,
        path: "/tools/pros-cons-list"
      }
    ]
  }
];

export const allTools: ToolEntry[] = toolCategories.flatMap((c) => c.tools);
