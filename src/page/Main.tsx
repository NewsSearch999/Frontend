import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { orderInstance } from '../api/api';
import ProductCard from '../components/ProductCard';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import OrderModal from '../components/OrderModal';
import MainHeader from '../components/Header';
import { useFetchProducts } from '../api/main-product-list';
import useIntersect, {
  IntersectHandler,
} from '../custom/intersection-observer.custom';

export interface Product {
  productId: number;
  productName: string;
  price: number;
  image: string;
  stock: number;
}

function MainPage() {
  const [searchParams, setSerchParams] = useSearchParams();
  const price = searchParams.get('price');
  const { data, hasNextPage, isFetching, fetchNextPage, remove } =
    useFetchProducts(price || '0');

  /**상품데이터 */
  const products = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data) : []),
    [data],
  );
  const ref = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target);

      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: '0px 0px 500px 0px' },
  );

  const navigate = useNavigate();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const priceInputRef = useRef<HTMLInputElement>(null);

  const searchSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    /**검색 데이터가 없을시 메인 페이지 reload*/
    const searchValue = searchInputRef.current!.value;
    const priceValue = priceInputRef.current!.value;
    const params = { search: searchValue, price: priceValue };
    if (!searchValue && priceValue == '0') {
      return remove();
    } else if (!searchValue && priceValue !== '0') {
      setSerchParams({ price: priceValue });
      remove();
      return;
    }
    /**검색어가 있는 경우 검색 페이지 navigate  */
    navigate({ pathname: '/search', search: `?${createSearchParams(params)}` });
  };

  const priceSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const priceValue = priceInputRef.current!.value;
    const searchValue = searchInputRef.current!.value;
    const params = { search: searchValue, price: priceValue };
    if (searchValue) {
      return navigate({
        pathname: '/search',
        search: `?${createSearchParams(params)}`,
      });
    }
    setSerchParams({ price: priceValue });
    remove();
    return;
  };

  const productMap = products?.map((country: Product) => {
    return <ProductCard key={country.productId} props={country} />;
  });

  return (
    <Main>
      <MainHeader />
      <SearchDiv>
        <SearchBar onSubmit={searchSubmit}>
          <SearchIcon color="disabled" />
          <SearchInput placeholder="상품을 검색하세요" ref={searchInputRef} />
        </SearchBar>
        <PriceInputSpan>가격: </PriceInputSpan>

        <PriceForm onSubmit={priceSubmit}>
          <PriceInput ref={priceInputRef} defaultValue="0" type="number" />
        </PriceForm>
      </SearchDiv>
      <ProductContainer>
        {products && productMap}
        <Target ref={ref} />
      </ProductContainer>
    </Main>
  );
}
export default MainPage;

const Target = styled.div`
  height: 1px;
`;

const PriceForm = styled.form``;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`;

const ProductContainer = styled.div`
  width: 80%;
  display: grid;
  justify-items: center;
  gap: 1rem 4rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
`;

const SearchBar = styled.form`
  width: 350px;
  height: 40px;
  padding-left: 10px;
  margin: 30px 0px 30px 0px;
  border-radius: 20px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 3px 5px rgb(0, 0, 0, 0.2);
  &:hover {
    box-shadow: 1px 3px 8px rgb(0, 0, 0, 0.4);
  }
  &:focus-within {
    box-shadow: 1px 3px 8px rgb(0, 0, 0, 0.4);
  }
`;

const SearchInput = styled.input`
  width: 300px;
  height: 30px;
  border-radius: 20px;
  border: none;
  padding: 5px 10px 5px 10px;
  &::placeholder {
    color: #adadad;
  }
  &:focus {
    outline: none;
  }
`;

const SearchDiv = styled.div`
  display: flex;
  align-items: center;
`;

const PriceInputSpan = styled.div`
  font-size: 15px;
  margin: 0px 10px 0px 10px;
`;

const PriceInput = styled.input`
  width: 80px;
  height: 18px;
  &:focus-within {
    outline: none;
  }
`;
