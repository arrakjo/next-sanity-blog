import Image from "next/image";
import urlFor from "../lib/urlFor";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import ClientSideRoute from "./ClientSideRoute";

type Props = {
  posts: Post[];
};

function BlogList({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-5 gap-5 gap-y-16 pb-10">
      {posts.map((post) => (
        <ClientSideRoute key={post._id} route={`/post/${post.slug.current}`}>
          <div className="group cursor-pointer flex flex-col">
            <div className="relative w-full h-96 drop-shadow-xl group-hover:scale-105 transition-transform duration-150 ease-out">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.author.name}
                className="object-cover object-left lg:object-center rounded-md"
                fill
              />

              <div className="absolute bottom-1 left-1 right-1 w-[calc(100% - 8px)] bg-[#0f0f0f] rounded text-white p-5 flex justify-between">
                <div>
                  <p className="font-semibold line-clamp-1">{post.title}</p>
                  <p className="text-sm">
                    {new Date(post._createdAt).toLocaleDateString("et-EE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="flex font-semibold items-center justify-center gap-1 mt-2 bg-[#202020] py-2 px-4 rounded-full">
                    <span>Read more</span>
                    <ArrowUpRightIcon className="h-3 w-3" />
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2 items-center">
                  {post.categories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-[#202020] text-center text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <p>{category.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ClientSideRoute>
      ))}
    </div>
  );
}

export default BlogList;
