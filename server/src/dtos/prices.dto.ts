import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export type PriceListOrder = "asc" | "desc";
export type PriceListSort =
  | "buyPrice"
  | "name"
  | "sellPrice"
  | "symbol"
  | "updatedAt";

export interface ListPricesQuery {
  order?: string;
  page?: string;
  pageSize?: string;
  q?: string;
  sort?: string;
  source?: string;
  type: string;
}

export interface ListPricesParams {
  order: PriceListOrder;
  page: number;
  pageSize: number;
  q?: string;
  sort: PriceListSort;
  source?: string;
  type: string;
}

export type GetPricesRequest = Request<
  ParamsDictionary,
  unknown,
  unknown,
  ListPricesQuery
>;
