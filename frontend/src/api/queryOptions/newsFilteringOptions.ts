import type {
  PaginatedResponse,
  Post,
  PostSearch,
  PostUrlQuery,
} from "@/lib/types";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { POST_FILTERING_URL } from "@/api/endpoints.ts";
import { publicApi } from "@/api/api";
import { useParams } from "@tanstack/react-router";

const filteringOptions = (options: PostUrlQuery) => {
  const { lang } = useParams({ strict: false });
  const { category, page, page_size: pageSize } = options;

  return queryOptions({
    queryKey: ["posts", { category, page, pageSize }, lang],
    queryFn: (): Promise<PaginatedResponse<Post>> =>
      fetchPosts({ category, page, pageSize }),

    placeholderData: keepPreviousData,
  });
};

export default filteringOptions;

const fetchPosts = async (options: PostSearch) => {
  try {
    const response = await publicApi.get(POST_FILTERING_URL, {
      params: {
        category: options.category || undefined,
        page: options.page || undefined, // Django получит ?page=...
        page_size: options.pageSize || undefined,
      },
    });

    return response.data;
    // return response.data.results;
    // <-- ВНИМАНИЕ: Здесь возвращается ТОЛЬКО массив результатов!
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
