import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { Product } from '../page/Main';
import { orderInstance } from './api';

const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  // list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  // details: () => [...productKeys.all, 'detail'] as const,
  // detail: (id: number) => [...productKeys.details(), id] as const,
};

/** 무한 스크롤 */
export const useFetchProducts = () =>
  /** 키,비동기 호출,*/
  useInfiniteQuery(
    productKeys.lists(),
    ({ pageParam = { lastPrice: 1, lastId: 0 } }: QueryFunctionContext) => {
      return orderInstance.get<Product[]>(
        `/main/${pageParam.lastPrice}/${pageParam.lastId}`,
      );
    },
    {
      getNextPageParam: ({ data }) => {
        const { productId: lastId, price: lastPrice } = data[data.length - 1];
        return data.length < 20
          ? undefined
          : { lastId: lastId, lastPrice: lastPrice };
      },
    },
  );
