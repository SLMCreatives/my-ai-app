import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-row gap-2">
          <Image
            className="h-12 w-auto"
            src="/UIU_logo.png"
            alt="UNITAR logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            UNITAR AI Assistant
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Copy Writer</CardTitle>
              <CardDescription>
                Write a blog post for UNITAR campus event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Write a blog post for UNITAR campus event</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/blog-writer">
                  Go To Generator <ChevronRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Copy Writer</CardTitle>
              <CardDescription>
                Write a marketing post for UNITAR campus event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Write a marketing post for UNITAR campus event</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled asChild>
                <Link href="#">
                  Go To Generator <ChevronRight className="ml-2" />{" "}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Copy Writer</CardTitle>
              <CardDescription>
                Write a lifestyle post for UNITAR website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Write a lifestyle post for UNITAR website</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled asChild>
                <Link href="#">
                  Go To Generator <ChevronRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
