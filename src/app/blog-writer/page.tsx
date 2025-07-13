"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type Generation = {
  title: string;
  body: string;
  tags: string[];
  slug: string;
  excerpt: string;
};

export default function BlogPage() {
  const [generation, setGeneration] = useState<Generation | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [language, setLanguage] = useState("English");
  //const { messages } = useChat();

  const formRef = useRef<HTMLFormElement>(null);

  const [data, setData] = useState({
    event_name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    cta: "",
    language: ""
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
      navigator.clipboard.writeText(JSON.stringify(generation, null, 2));
    } else {
      unsecuredCopyToClipboard(JSON.stringify(generation, null, 2));
    }
    toast("Copied to clipboard");
  };

  return (
    <div className="flex flex-col w-full lg:max-w-2xl py-24 pt-10 mx-auto stretch justify-start px-8 md:px-10">
      <div className=" flex flex-col gap-0">
        <div className="flex flex-row justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">UNITAR Blog Writer</h1>
          <Button variant={"ghost"} size={"icon"} className="self-end" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
        </div>
        {hide === false && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
            ref={formRef}
          >
            <p className="mb-4 text-md italic">
              Please provide the following details:
            </p>
            <div className="flex flex-row gap-2 w-full py-2">
              <div className="flex flex-col gap-4 w-full">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={data.time}
                  onChange={(e) => setData({ ...data, time: e.target.value })}
                />
              </div>
            </div>
            <Label htmlFor="event_name">Title</Label>
            <Input
              id="event_name"
              type="text"
              value={data.event_name}
              onChange={(e) => setData({ ...data, event_name: e.target.value })}
            />

            <Label htmlFor="description">Brief</Label>
            <Textarea
              id="description"
              maxLength={500}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
            {data.description.length <= 500 && (
              <p className="-mt-2 flex text-xs text-muted-foreground w-full justify-end">
                {data.description.length}/500 chars
              </p>
            )}
            <Label htmlFor="cta">CTA</Label>
            <Input
              id="cta"
              type="text"
              value={data.cta}
              onChange={(e) => setData({ ...data, cta: e.target.value })}
            />
            <Label htmlFor="Language">Language</Label>
            <div className="flex flex-row gap-2">
              <Switch
                id="Language"
                value="English"
                checked={language === "English"}
                onCheckedChange={(checked) =>
                  setLanguage(checked ? "English" : "Bahasa Melayu")
                }
              />
              <Label htmlFor="Language">{language}</Label>
            </div>
            <div className="flex flex-row gap-2 fixed bottom-10 right-10">
              <Button
                type="submit"
                className=" order-2"
                variant={"default"}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await fetch("/api/schema", {
                    method: "POST",
                    body: JSON.stringify({
                      prompt:
                        `Blog Title: ${data.event_name}` +
                        `When: ${data.date} ${data.time}` +
                        `Brief: ${data.description}` +
                        `CTA: ${data.cta}` +
                        `Language: ${language}`
                    })
                  }).then((response) => {
                    response.json().then((json) => {
                      setHide(true);
                      setGeneration(json.object);
                      setIsLoading(false);
                    });
                  });
                }}
              >
                {isLoading ? "Generating..." : "Generate Blog Post"}
              </Button>
              <Button
                type="submit"
                className=" opacity-50 hover:opacity-100"
                variant={"ghost"}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await fetch("/api/schema", {
                    method: "POST",
                    body: JSON.stringify({
                      prompt: `Write a blog post about Onboarding September intake students at UNITAR. `
                    })
                  }).then((response) => {
                    response.json().then((json) => {
                      setHide(true);
                      setGeneration(json.object);
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
          <div className="flex flex-col gap-4 py-4">
            {typeof generation === "object" ? (
              <div className="flex flex-col gap-4">
                <Label className="text-sm">Title</Label>
                <h2 className="text-4xl font-bold">{generation.title}</h2>
                <Label className="text-sm">Slug</Label>
                <Input
                  type="url"
                  className="w-full"
                  value={`unitar.my/${generation.slug}`}
                  readOnly
                />
                <Label className="text-sm">Excerpt</Label>
                <Textarea
                  className="w-full"
                  value={generation.excerpt}
                  readOnly
                />
                <Label className="text-sm">Keywords</Label>
                <div className="flex flex-row gap-2 flex-wrap">
                  {generation.tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
                  ))}
                </div>
                <hr className="my-4" />
                <Label className="text-sm">Body</Label>
                <div className="bg-slate-700 p-4 rounded-md">
                  <p
                    className="text-md whitespace-break-spaces text-white prose "
                    contentEditable
                    suppressContentEditableWarning={true}
                  >
                    {generation.body}
                  </p>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-bold">Generated Blog Post</h2>
            )}

            <div className="flex flex-row gap-2 py-4 fixed bottom-10 left-1/2 transform -translate-x-1/2">
              <Button
                variant={"default"}
                onClick={() => copyToClipboard(generation as string)}
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
