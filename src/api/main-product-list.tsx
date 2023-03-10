import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { Product } from '../page/Main';
import { orderInstance } from './api';

const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
};

/** 무한 스크롤 */
export const useFetchProducts = (price: string) => {
  console.log('infinitySearch');
  console.log(price);

  /** 키,비동기 호출,*/
  return useInfiniteQuery(
    productKeys.lists(),
    ({ pageParam = { lastPrice: price, lastId: 0 } }: QueryFunctionContext) => {
      return orderInstance.get<Product[]>(
        `/main/${pageParam.lastPrice}/${pageParam.lastId}`,
      );
    },
    {
      getNextPageParam: ({ data }) => {
        if (!data.length) return undefined;
        const { productId: lastId, price: lastPrice } = data[data.length - 1];
        return data.length < 20
          ? undefined
          : { lastId: lastId, lastPrice: lastPrice };
      },
    },
  );
};

export const useFetchSearchProducts = (search: string, price: string) =>
  /** 키,비동기 호출,*/
  useInfiniteQuery(
    productKeys.lists(),
    ({ pageParam = { lastPrice: price, lastId: 0 } }: QueryFunctionContext) => {
      return orderInstance.get<Product[]>(
        `/search/${search}/${pageParam.lastPrice}/${pageParam.lastId}`,
      );
    },
    {
      getNextPageParam: ({ data }) => {
        if (!data.length) return;
        const { productId: lastId, price: lastPrice } = data[data.length - 1];
        return data.length < 20
          ? undefined
          : { lastId: lastId, lastPrice: lastPrice };
      },
    },
  );
