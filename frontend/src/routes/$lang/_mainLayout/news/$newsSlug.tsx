import { createFileRoute } from "@tanstack/react-router";
import { getNewsPostDetailAction } from "@/api/actions";

export const Route = createFileRoute("/$lang/_mainLayout/news/$newsSlug")({
  // component: RouteComponent,

  loader: async ({ params: { newsSlug } }) => {
    const response = await getNewsPostDetailAction(newsSlug);
    console.log("🚀 ~ response:", response);
    return {
      post: response.data,
    };
  },

  // pendingComponent: () => (
  //   <>
  //     <ProductInfoSkeleton />
  //     <CustomerReviewsSkeleton />
  //     <ReviewCardContainerSkeleton />
  //     <ProductSection
  //     />
  //   </>
  // ),

  // errorComponent: () => {
  //   toast.error("Something went wrong");
  //   return <Error />;
  // },
});

// function RouteComponent() {
//   return <div>Hello "/$lang/_mainLayout/news/$newsSlug"!</div>
// }
