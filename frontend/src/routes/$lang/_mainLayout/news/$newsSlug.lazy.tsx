import { createLazyFileRoute } from "@tanstack/react-router";
import { type Post } from "@/lib/types";
import { BASE_URL } from "@/api/api";
import { useParams } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/appLink/AppLink";

export const Route = createLazyFileRoute("/$lang/_mainLayout/news/$newsSlug")({
  component: IndividualPostComponent,
});

interface LoaderData {
  post: Post;
}

function IndividualPostComponent() {
  const { post } = Route.useLoaderData() as LoaderData;

  // Вытаскиваем живой параметр lang из URL роутера
  const { lang } = useParams({ from: "/$lang" });

  return (
    <section className="my-10">
      <div className="container">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row mb-10 lg:justify-between">
            <img
              className="w-full lg:max-w-1/2"
              src={`${BASE_URL}${post.image}`}
              alt={`image for Post Category ${post.category.name}`}
            />
            <div className="flex flex-col justify-between">
              <h3
                className="lg:ml-5 font-bold text-xl sm:text-2xl max-lg:mb-4
                max-lg:mt-10 sm:leading-8 lg:text-end"
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
                <Link
                  to="/news/newsIndex"
                  // путь к индексной странице новостей
                  // так как импортируем AppLink, то можно укороченный путь прописать
                  //  to="/$lang/news/newsIndex" // Точный путь
                  search={{ category: post.category.slug }}
                  // Передаем слаг категории в URL-параметры [1.3]
                  className="bg-myMainColor text-white text-base sm:text-xl
                  p-1 px-2 sm:px-4 sm:p-2 font-semibold sm:leading-8 rounded-sm
                  cursor-pointer"
                >
                  {post.category.name}
                </Link>
              </div>
            </div>
          </div>
          <div
            className="text-primary text-base sm:text-xl md:leading-8 mb-6
            text-justify hyphens-auto break-words"
            lang={lang}
          >
            {post.text}
          </div>
        </div>
      </div>
    </section>
  );
}
