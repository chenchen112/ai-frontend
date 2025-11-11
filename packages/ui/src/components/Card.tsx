import React from 'react';
import * as CardPrimitive from '@radix-ui/react-card';

export const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Root
      ref={ref}
      className={[
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
Card.displayName = CardPrimitive.Root.displayName;

export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Header>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Header
      ref={ref}
      className={[
        'flex flex-col space-y-1.5 p-6',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
CardHeader.displayName = CardPrimitive.Header.displayName;

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Title
      ref={ref}
      className={[
        'text-2xl font-semibold leading-none tracking-tight',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
CardTitle.displayName = CardPrimitive.Title.displayName;

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Description
      ref={ref}
      className={[
        'text-sm text-muted-foreground',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
CardDescription.displayName = CardPrimitive.Description.displayName;

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Content
      ref={ref}
      className={[
        'p-6 pt-0',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
CardContent.displayName = CardPrimitive.Content.displayName;

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CardPrimitive.Footer>>(
  ({ className, ...props }, ref) => (
    <CardPrimitive.Footer
      ref={ref}
      className={[
        'flex items-center p-6 pt-0',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    />
  )
);
CardFooter.displayName = CardPrimitive.Footer.displayName;
