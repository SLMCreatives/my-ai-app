"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function BlogPage() {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    event_name: "",
    event_description: "",
    date: "",
    time: "",
    location: "",
    description: ""
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch sm:px-4 px-10">
      <div>
        {generation === "" && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <p className="mb-4 ">Please provide the following details:</p>
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
            <Button
              type="submit"
              className="mt-4 fixed bottom-10 left-1/2 transform -translate-x-1/2"
              variant={"default"}
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
                    setGeneration(json.text);
                    setIsLoading(false);
                  });
                });
              }}
            >
              {isLoading ? "Generating..." : "Generate Blog Post"}
            </Button>
          </form>
        )}
        {generation !== "" && (
          <div>
            <p className="whitespace-pre-wrap prose">{generation}</p>
            <div className="flex flex-col gap-2 py-4">
              <Button
                variant={"default"}
                onClick={() =>
                  navigator.clipboard.writeText(generation).then(() => {
                    toast("Copied to clipboard!");
                  })
                }
              >
                Copy
              </Button>
              <Button onClick={() => setGeneration("")} variant={"destructive"}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
