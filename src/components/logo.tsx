import Link from 'next/link';

interface LogoProps {
  simple?: boolean;
}

export function Logo({ simple = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2" aria-label="Risaletennur Ana Sayfa">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground font-headline">
        R
      </div>
      {!simple && <span className="hidden text-lg font-bold sm:inline-block font-headline">Risaletennur</span>}
    </div>
  );
}
