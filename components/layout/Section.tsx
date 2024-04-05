import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Section = forwardRef<HTMLDivElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-auto flex flex-col items-start justify-center gap-6",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
);
Section.displayName = "Section";

const SectionHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "flex flex-col md:flex-row items-start justify-center gap-2",
      className
    )}
    {...props}
  >
    {props.children}
  </h1>
));
SectionHeader.displayName = "SectionHeader";

const SectionTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("text-secondary-foreground font-medium text-lg", className)}
    {...props}
  >
    {props.children}
  </h1>
));
SectionTitle.displayName = "SectionTitle";

const SectionDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm leading-7 ", className)}
    {...props}
  >
    {props.children}
  </p>
));
SectionDescription.displayName = "SectionDescription";

const SectionContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props}>
    {props.children}
  </div>
));
SectionContent.displayName = "SectionContent";

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
};
