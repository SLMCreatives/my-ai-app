"use client";

import { useState } from "react";

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
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div>
        {generation === "" && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2"
          >
            <label htmlFor="event_name">Event Name</label>
            <input
              id="event_name"
              type="text"
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={data.event_name}
              onChange={(e) => setData({ ...data, event_name: e.target.value })}
            />
            <label htmlFor="event_description">Event Description</label>
            <input
              id="event_description"
              type="text"
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={data.event_description}
              onChange={(e) =>
                setData({ ...data, event_description: e.target.value })
              }
            />
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
            <label htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={data.time}
              onChange={(e) => setData({ ...data, time: e.target.value })}
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={data.description}
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
            <button
              type="submit"
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
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            >
              Generate Blog Post
            </button>
          </form>
        )}
        {generation !== "" && (
          <div>
            <p className="whitespace-pre-wrap prose">{generation}</p>
            <button
              className="p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              onClick={() =>
                navigator.clipboard.writeText(generation).then(() => {
                  alert("Copied to clipboard!");
                })
              }
            >
              Copy
            </button>
          </div>
        )}
        {isLoading ? "Loading..." : ""}
      </div>
    </div>
  );
}
