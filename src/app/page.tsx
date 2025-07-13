import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
              <CardTitle>Blog Post Writer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md italic text-muted-foreground">
                Write a blog post for UNITAR website.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-fit" variant="link" asChild>
                <Link href="/blog-writer">
                  Generate Post <ChevronRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md italic text-muted-foreground">
                Write a campaign post.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-fit" variant="link" disabled>
                Coming Soon <ChevronRight className="" />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md italic text-muted-foreground">
                Write a lifestyle post for UNITAR website
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-fit" variant="link" disabled>
                Coming Soon <ChevronRight className="" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
