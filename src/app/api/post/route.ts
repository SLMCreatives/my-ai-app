type Generation = {
  title: string;
  body: string;
  tags: string[];
  slug: string;
  excerpt: string;
  keywords: string;
};

export async function POST(req: Request) {
  const { generation }: { generation: Generation } = await req.json();

  const response = await fetch(`${process.env.WORDPRESS_API_URL}/wp/v2/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WORDPRESS_API_TOKEN}`
    },
    body: JSON.stringify({
      title: generation.title,
      content: generation.body,
      excerpt: generation.excerpt,
      status: "draft",
      categories: generation.tags.map((tag) => ({
        name: tag,
        slug: tag.toLowerCase().replace(/\s/g, "-")
      })),
      meta: {
        _yoast_wpseo_focuskw: generation.keywords
      }
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return Response.json(await response.json());
}
