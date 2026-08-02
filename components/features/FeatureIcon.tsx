import {
  Sparkles,
  ScanFace,
  Zap,
  Database,
  SlidersHorizontal,
  Lock,
  Star,
  QrCode,
  Stamp,
  MessageCircle,
  FolderTree,
  type LucideIcon,
} from "lucide-react";

// The DB stores an icon *name*; the frontend owns the mapping. A missing or
// unknown key degrades to Sparkles rather than crashing the page, so a new
// feature seeded with an icon we haven't registered yet still renders.
const ICONS: Record<string, LucideIcon> = {
  ScanFace,
  Zap,
  Database,
  SlidersHorizontal,
  Lock,
  Star,
  QrCode,
  Stamp,
  MessageCircle,
  FolderTree,
};

export default function FeatureIcon({
  name,
  size = 18,
}: {
  name?: string | null;
  size?: number;
}) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon size={size} aria-hidden />;
}
