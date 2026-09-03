import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center cursor-pointer rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all active:translate-y-px outline-none select-none disabled:pointer-events-none disabled:bg-none disabled:opacity-50 disabled:shadow-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary bg-[image:var(--control-sheen)] text-primary-foreground shadow-[var(--shadow-raised)] hover:bg-primary/95 hover:shadow-[var(--shadow-raised-hover)] active:shadow-[var(--shadow-pressed)]",
        cta:
          "border-cta bg-cta bg-[image:var(--control-sheen)] text-cta-foreground shadow-[var(--shadow-raised)] hover:bg-[#e94d22] hover:shadow-[var(--shadow-raised-hover)] active:shadow-[var(--shadow-pressed)]",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        ghost:
          "border-transparent bg-none shadow-none hover:bg-secondary hover:text-foreground aria-expanded:bg-secondary active:translate-y-0",
        destructive:
          "border-destructive bg-destructive bg-[image:var(--control-sheen)] text-white shadow-[var(--shadow-raised)] hover:bg-destructive/90 hover:shadow-[var(--shadow-raised-hover)] active:shadow-[var(--shadow-pressed)]",
        link: "border-transparent bg-none text-foreground underline decoration-cta decoration-2 underline-offset-4 shadow-none hover:text-cta active:translate-y-0",
      },
      size: {
        default: "h-10 gap-2 px-4 has-[>svg]:px-3.5",
        xs: "h-6 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3.5 text-sm has-[>svg]:px-3",
        lg: "h-11 gap-2 px-6 text-[0.95rem] has-[>svg]:px-5",
        icon: "size-10",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
