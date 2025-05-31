"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useEmailProofVerification } from "~/hooks/useEmailProofVerification";

export function Vlayer() {
  const [emlContent, setEmlContent] = useState<string>("");
  const { startProving, verificationError } = useEmailProofVerification();

  const handleProving = () => {
    if (emlContent) {
      void startProving(emlContent);
      return;
    }
    throw new Error("No eml content");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Button
        variant="outline"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".eml";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const content = e.target?.result as string;
                setEmlContent(content);
              };
              reader.readAsText(file);
            }
          };
          input.click();
          console.log("Upload finished");
        }}
      >
        Upload EML File
      </Button>
      <div className="mt-5 flex justify-center">
        <Button variant="outline" onClick={handleProving}>
          Start Proving
        </Button>
      </div>
      {verificationError && (
        <div className="mt-5 flex justify-center">
          <p className="text-red-500">{verificationError.toString()}</p>
        </div>
      )}
    </div>
  );
}
