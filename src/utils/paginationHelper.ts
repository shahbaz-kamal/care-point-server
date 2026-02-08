import { IPaginationOptions, IPaginationOptionsResult } from "../app/types";

const calcualtePagination = (options: IPaginationOptions): IPaginationOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;

  const skip = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return { page, limit, skip, sortBy, sortOrder };
};


export const PaginationHelper={
    calcualtePagination
}