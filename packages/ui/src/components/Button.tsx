import React from 'react';
import * as ButtonPrimitive from '@radix-ui/react-button';
import { Slot } from '@radix-ui/react-slot';
import type { ButtonProps as ButtonPrimitiveProps } from '@radix-ui/react-button';

interface ButtonProps extends ButtonPrimitiveProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : ButtonPrimitive.Root;
    
    return (
      <Comp
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          // Variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-10 px-4 py-2 text-base',
          size === 'lg' && 'h-11 px-8 text-lg',
          className
        ].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Button.displayName = ButtonPrimitive.Root.displayName;
