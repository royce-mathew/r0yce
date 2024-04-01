"use client";

import React, { useState, useEffect } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion, MotionValue } from "framer-motion";

type AvatarStackProps = {
  images: string[];
};

const AvatarStack = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarStackProps
>(({ images, className, ...props }, ref) => {
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
        <AnimatePresence>
          <motion.div
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
          </motion.div>
        </AnimatePresence>
        <AvatarFallback>Profile</AvatarFallback>
      </Avatar>
    </div>
  );
});

export default AvatarStack;
