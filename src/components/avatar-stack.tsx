"use client";

import React, { useState, useEffect } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";

type AvatarStackProps = {
  images: string[];
  fallback?: string;
};

const AvatarStack = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarStackProps
>(({ images, className, fallback, ...props }, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(images[currentImageIndex]);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [images]);

  return (
    <div>
      <Avatar className={className} {...props}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            <m.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AvatarImage
                src={images[currentImageIndex]}
                className="object-cover absolute"
              />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  );
});

export default AvatarStack;
