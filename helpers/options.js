import { queryOptions } from "@tanstack/react-query";
import { getCategoryList } from "./endpoints";

export const categoriesOptions = queryOptions({
  queryKey: ["pokemon"],
  queryFn: getCategoryList,
});
