"use client"

import { cn } from "@/lib/utils"

interface SafeAreaProps {
  children: React.ReactNode
  className?: string
  top?: boolean
  bottom?: boolean
}

export default function SafeArea({ 
  children, 
  className, 
  top = true, 
  bottom = true 
}: SafeAreaProps) {
  return (
    <div 
      className={cn(
        "w-full",
        top && "pt-safe-area-inset-top",
        bottom && "pb-safe-area-inset-bottom",
        className
      )}
      style={{
        paddingTop: top ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: bottom ? 'env(safe-area-inset-bottom)' : undefined,
      }}
    >
      {children}
    </div>
  )
}