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
import Zap from "~icons/lucide/zap";
import Shield from "~icons/lucide/shield";
import Ban from "~icons/lucide/ban";
import Code from "~icons/lucide/code";

export const toolIconMappings: Record<string, any> = {
  "Text Case Converter": Type,
  "Text Counter": BarChart,
  "URL Encoder/Decoder": Link,
  "Base64 Encoder/Decoder": Lock,
  "Text Diff Checker": FileText,
  "Lorem Ipsum Generator": ScrollText,
  "Find and Replace": Search,
  "Text Sorter": ListOrdered,
  "JSON Formatter": FileJson,
  "JWT Decoder": IdCard,
  "UUID Generator": Ticket,
  "Unix Timestamp Converter": Clock,
  "HTML Entity Encoder/Decoder": FileCode,
  "Color Contrast Checker": Palette,
  "QR Code Generator": QrCode,
  "Unit Converter": Scale,
  "Slug Generator": FileEdit,
  "Password Generator": Key,
  "Pomodoro Timer": Timer,
  "To-Do List": ListTodo,
  "Pros & Cons List": Scale
};

export const featureIconMappings: Record<string, any> = {
  "Lightning Fast": Zap,
  "Privacy First": Shield,
  "No Ads": Ban,
  "Open Source": Code
};

export function getToolIcon(toolName: string) {
  return toolIconMappings[toolName] || FileText;
}

export function getFeatureIcon(featureTitle: string) {
  return featureIconMappings[featureTitle] || Zap;
}
