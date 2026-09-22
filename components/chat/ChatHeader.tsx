import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function ChatHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-navy-hairline bg-white/90 backdrop-blur-[16px]">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" aria-label="DataTwin home" className="flex flex-shrink-0 items-center">
          <Logo className="h-5 w-auto" />
        </Link>
        <p className="truncate text-[13.5px] font-medium text-navy-muted">{title}</p>
      </div>
    </header>
  );
}
