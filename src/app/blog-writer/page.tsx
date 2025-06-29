"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function BlogPage() {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const { messages } = useChat();

  const formRef = useRef<HTMLFormElement>(null);

  const [data, setData] = useState({
    event_name: "",
    event_description: "",
    date: "",
    time: "",
    location: "",
    description: ""
  });

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };

  /**
   * Copies the text passed as param to the system clipboard
   * Check if using HTTPS and navigator.clipboard is available
   * Then uses standard clipboard API, otherwise uses fallback
   */
  const copyToClipboard = (generation: string) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(generation);
    } else {
      unsecuredCopyToClipboard(generation);
    }
    toast("Copied to clipboard");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch px-4 md:px-10">
      <div>
        <h1 className="text-2xl font-bold">Event Blog Writer</h1>
        {hide === false && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 py-4"
            ref={formRef}
          >
            <p className="mb-4 text-md italic text-white/70">
              Please provide the following details:
            </p>
            <Label htmlFor="event_name">Event Name</Label>
            <Input
              id="event_name"
              type="text"
              value={data.event_name}
              onChange={(e) => setData({ ...data, event_name: e.target.value })}
            />
            <Label htmlFor="event_description">Event Brief</Label>
            <Input
              id="event_description"
              type="text"
              value={data.event_description}
              onChange={(e) =>
                setData({ ...data, event_description: e.target.value })
              }
            />
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={data.time}
              onChange={(e) => setData({ ...data, time: e.target.value })}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
            <div className="flex flex-row gap-4 fixed bottom-10 left-1/2 transform -translate-x-1/2">
              <Button
                type="submit"
                className=""
                variant={"default"}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await fetch("/api/blog", {
                    method: "POST",
                    body: JSON.stringify({
                      prompt:
                        `Event Name: ${data.event_name}` +
                        `When: ${data.date} ${data.time}` +
                        `Location: ${data.location}` +
                        `Description: ${data.description}`
                    })
                  }).then((response) => {
                    response.json().then((json) => {
                      setHide(true);
                      setGeneration(json.text);
                      setIsLoading(false);
                    });
                  });
                }}
              >
                {isLoading ? "Generating..." : "Generate Blog Post"}
              </Button>
              <Button
                type="submit"
                className=""
                variant={"default"}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const fakedata = {
                    event_name: "",
                    event_description: "",
                    date: `${new Date().toLocaleDateString()}`,
                    time: `${new Date().toLocaleTimeString()}`,
                    location: "UNITAR Main Campus",
                    description:
                      "Make up a funny story that happened. Make it into a learnable lesson for uni students."
                  };
                  await fetch("/api/blog", {
                    method: "POST",
                    body: JSON.stringify({
                      prompt:
                        `Event Name: ${fakedata.event_name}` +
                        `When: ${fakedata.date} ${fakedata.time}` +
                        `Location: ${fakedata.location}` +
                        `Description: ${fakedata.description}`
                    })
                  }).then((response) => {
                    response.json().then((json) => {
                      setHide(true);
                      setGeneration(json.text);
                      setIsLoading(false);
                    });
                  });
                }}
              >
                {isLoading ? "Generating..." : "Test"}
              </Button>
            </div>
          </form>
        )}
        {generation !== "" && (
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap">
                  <div>
                    <div className="font-bold">{m.role}</div>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-4 px-2 rounded-md ">
              <p className="whitespace-pre-wrap prose">{generation}</p>
            </div>
            <div className="flex flex-row gap-2 py-4 fixed bottom-10 left-1/2 transform -translate-x-1/2">
              <Button
                variant={"default"}
                onClick={() => copyToClipboard(generation)}
              >
                Copy
              </Button>
              <Button
                onClick={() => {
                  setGeneration("");
                  setHide(false);
                }}
                variant={"destructive"}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
