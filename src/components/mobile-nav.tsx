"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/docs";

export function SubNav({
  titleName,
  pathname,
  onOpenChange,
}: {
  titleName: string;
  pathname: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const foundSubnav = siteConfig.sidebarNav.find(
    (item) => item.title === titleName
  );

  if (foundSubnav === undefined) return null;

  return (
    <div className="flex flex-col space-y-3 text-l border-l px-3 w-full mt-4">
      {foundSubnav.items.map((subItem, subIndex) => (
        <Button key={subIndex} className="w-full" variant="outline" asChild>
          <MobileLink
            href={subItem.href as string}
            className={cn(
              "transition-colors hover:text-foreground/80 text-foreground/60 font-light justify-between w-full",
              pathname === subItem.href ? "text-primary" : ""
            )}
            aria-label={subItem.title}
            onOpenChange={onOpenChange}
          >
            <span className="truncate overflow-hidden w-36">
              {subItem.title}
            </span>
            <Icons.code className="h-5 w-5" />
          </MobileLink>
        </Button>
      ))}
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const firstPath = pathname.split("/")[1];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.hamburger />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center">
          <span className="font-bold text-lg">Navigation Menu</span>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 px-6">
          <div className="flex flex-col space-y-3 text-lg">
            {siteConfig.mainNav.map((item, index) => (
              <div key={index}>
                <Button variant="outline" asChild>
                  <MobileLink
                    key={index}
                    href={item.href as string}
                    aria-label={item.title}
                    className={cn(
                      "transition-colors hover:text-foreground/80 text-foreground/60 justify-between w-full",
                      firstPath === `${item.href?.slice(1)}`
                        ? "text-foreground"
                        : ""
                    )}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                    <Icons.link className="h-5 w-5" />
                  </MobileLink>
                </Button>
                <SubNav
                  titleName={item.title}
                  onOpenChange={setOpen}
                  pathname={pathname}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
