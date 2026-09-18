import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { LayoutDashboard, Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { navItems } from './article-form-topics';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Separator } from './ui/separator';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold">
              {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground/70 transition-colors hover:text-primary"
                  >
                  {item.name}
                  </Link>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="sr-only">Yönetici Paneli</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Yönetici Paneli</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Navigasyonu aç</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className='w-full sm:max-w-xs'>
                <SheetHeader className="mb-8 border-b pb-4">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-bold text-muted-foreground hover:text-primary transition-colors px-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                   <Separator />
                   <div className="flex items-center justify-between px-2 pt-2">
                      <div className="text-lg font-bold text-muted-foreground">
                        Tema
                      </div>
                      <ThemeToggle />
                   </div>
                   <Link
                      href="/admin"
                      className="text-lg font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-2"
                    >
                      <LayoutDashboard className="h-5 w-5" /> Yönetici Paneli
                    </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
