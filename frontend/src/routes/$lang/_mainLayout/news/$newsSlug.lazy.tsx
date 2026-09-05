import { createLazyFileRoute } from "@tanstack/react-router";
import { type Post } from "@/lib/types";
import { BASE_URL } from "@/api/api";

export const Route = createLazyFileRoute("/$lang/_mainLayout/news/$newsSlug")({
  component: IndividualPostComponent,
});

interface LoaderData {
  post: Post;
}

function IndividualPostComponent() {
  const { post } = Route.useLoaderData() as LoaderData;

  return (
    <section className="my-30">
      <div className="container">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row mb-10">
            <img
              className="h-full w-full"
              src={`${BASE_URL}${post.image}`}
              alt={`image for Post Category ${post.category.name}`}
            />
            <div className="flex flex-col justify-between">
              <h3
                className="lg:ml-5 font-bold text-xl sm:text-2xl max-lg:mb-8
                sm:leading-8"
              >
                {post.title}
              </h3>

              <div className="max-lg:mr-auto lg:ml-auto">
                <div
                  className="text-primary text-base sm:text-lg lg:mb-6
                  text-start lg:text-end"
                >
                  {post.created_at.slice(0, 10)}
                </div>
                <div
                  className="bg-myMainColor text-white text-base sm:text-xl
                  p-1 px-2 sm:px-4 sm:p-2 font-semibold sm:leading-8 rounded-sm"
                >
                  {post.category.name}
                </div>
              </div>
            </div>
          </div>
          <div className="text-primary text-base sm:text-xl md:leading-8 mb-6">
            {post.text}
          </div>
        </div>
      </div>
    </section>
  );
}
