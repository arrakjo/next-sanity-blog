import { groq } from "next-sanity";
import Image from "next/image";
import { client } from "../../../../lib/sanity.client";
import urlFor from "../../../../lib/urlFor";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "../../../../components/RichTextComponents";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const query = groq`
  *[_type=='post'] 
  {
    slug
  }
  `;

  const slugs: Post[] = await client.fetch(query);
  const slugRoutes = slugs.map((slug) => slug.slug.current);

  return slugRoutes.map((slug) => ({
    slug,
  }));
}

async function Post({ params: { slug } }: Props) {
  const query = groq`
    *[_type=='post' && slug.current == $slug][0] 
    {
      ...,
      author->,
      categories[]->
    }
  `;

  const post: Post = await client.fetch(query, { slug });

  return (
    <article className="px-5 pb-16">
      <section className="space-y-2 text-white">
        <div className="relative min-h-56 flex flex-col md:flex-row justify-between">
          <div className="absolute top-0 w-full h-full opacity-20 blur-sm p-5">
            <Image
              className="object-cover object-center mx-auto"
              src={urlFor(post.mainImage).url()}
              alt={post.author.name}
              fill
            />
          </div>
        </div>

        <section className="p-5 bg-[#CD8DD1] rounded">
          <div className="flex flex-col md:flex-row justify-between gap-y-4">
            <div>
              <h1 className="text-4xl font-semibold">{post.title}</h1>
              <p className="text-sm">
                {new Date(post._createdAt).toLocaleDateString("et-EE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                className="rounded-full"
                src={urlFor(post.author.image).url()}
                alt={post.author.name}
                height={40}
                width={40}
              />

              <div>
                <h3 className="text-lg font-semibold">{post.author.name}</h3>
                <div></div>
              </div>
            </div>

            <div>
              <h2 className="italic pt-10">{post.description}</h2>
              <div className="flex items-center justify-end mt-auto space-x-2">
                {post.categories.map((category) => (
                  <p
                    key={category._id}
                    className="bg-[#202020] text-center text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="py-10">
        <PortableText value={post.body} components={RichTextComponents} />
      </section>
    </article>
  );
}

export default Post;
