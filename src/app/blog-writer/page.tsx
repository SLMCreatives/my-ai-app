"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

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
    language: "",
    keywords: "",
    target: "",
    tone: ""
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

  const handlePushtoWordpress = async (generation: Generation) => {
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(generation)
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
            <p className="text-md italic">
              Please provide the following details:
            </p>

            <Tabs defaultValue="details">
              <TabsList className="space-x-4">
                <TabsTrigger value="details" className="text-white font-bold">
                  Details
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-white font-bold">
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="flex flex-col gap-4 p-4 ring-stone-500">
                  <p className="text-xl font-bold">Blog Details</p>

                  <Label htmlFor="event_name">Title</Label>
                  <Input
                    id="event_name"
                    type="text"
                    placeholder="e.g. Onboarding September Intake Students at UNITAR"
                    value={data.event_name}
                    onChange={(e) =>
                      setData({ ...data, event_name: e.target.value })
                    }
                  />

                  <Label htmlFor="description">Brief</Label>
                  <Textarea
                    id="description"
                    maxLength={1000}
                    rows={10}
                    placeholder="e.g. Join us for the onboarding of our September intake students at UNITAR. This event will provide an overview of our programs, facilities, and support services."
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                  {data.description.length <= 500 && (
                    <p className="-mt-2 flex text-xs text-muted-foreground w-full justify-end">
                      {data.description.length}/1000 chars
                    </p>
                  )}
                  <Label htmlFor="cta">CTA</Label>
                  <Input
                    id="cta"
                    type="text"
                    value={data.cta}
                    onChange={(e) => setData({ ...data, cta: e.target.value })}
                  />
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-white font-bold">
                      Language
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <RadioGroup
                        defaultValue="bahasa-melayu"
                        onValueChange={setLanguage}
                      >
                        <div className="flex flex-row md:flex-col gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="bahasa-melayu"
                              id="bahasa-melayu"
                            />
                            <Label htmlFor="bahasa-melayu">Bahasa Melayu</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="english" id="english" />
                            <Label htmlFor="english">English</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-white font-bold">
                      Target Audience
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <RadioGroup
                        defaultValue="all"
                        onValueChange={(value) => {
                          setData({ ...data, target: value });
                        }}
                      >
                        <div className="flex flex-row md:flex-col gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">Both</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="undergraduate"
                              id="undergraduate"
                            />
                            <Label htmlFor="undergraduate">Undergraduate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="postgraduate"
                              id="postgraduate"
                            />
                            <Label htmlFor="postgraduate">Postgraduate</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-white font-bold">
                      Voice & Tone
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <RadioGroup
                        defaultValue="warm"
                        onValueChange={(value) => {
                          setData({ ...data, tone: value });
                        }}
                      >
                        <div className="flex flex-row md:flex-col gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="warm" id="warm" />
                            <Label htmlFor="warm">Warm</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="energetic" id="energetic" />
                            <Label htmlFor="energetic">Energetic</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="inspirational"
                              id="inspirational"
                            />
                            <Label htmlFor="inspirational">Inspirational</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-white font-bold">
                      SEO Keywords
                    </AccordionTrigger>
                    <AccordionContent className="">
                      <Input
                        id="keywords"
                        type="text"
                        value={data.keywords}
                        placeholder="e.g. UNITAR, Onboarding, Online Learning"
                        onChange={(e) =>
                          setData({ ...data, keywords: e.target.value })
                        }
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>

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
                        `Language: ${language}` +
                        `Target Audience: ${data.target}` +
                        `Tone: ${data.tone}` +
                        `Keywords: ${data.keywords}`
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
                disabled
                onClick={() => handlePushtoWordpress(generation as Generation)}
              >
                Push
              </Button>
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
