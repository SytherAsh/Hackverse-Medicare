import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreview() {
  return (
    (<div
      className="h-[40rem] relative w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.7}
          maxSize={1.5}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#1e81b0" />
      </div>
    </div>)
  );
}
