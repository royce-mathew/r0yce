"use client";
import React from "react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full space-y-5 p-5">
      <Image
        title="Error 404"
        width={350}
        height={350}
        alt="Surprised Pikachu"
        className="rounded overflow-clip"
        src="/images/Error.jpg"
      />
      <div className="text-center">
        <h1 className="scroll-m-20 font-cal text-5xl tracking-tight lg:text-6xl">
          404
        </h1>
        <h3 className="tracking-tight">Not Found</h3>
      </div>
    </div>
  );
}
