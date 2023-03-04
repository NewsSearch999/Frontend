import React, { useEffect, useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { orderInstance } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
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
  const [search, setSearch] = useState('');

  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchProducts();
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

  const handleChange = ({ target: { value } }: { target: { value: string } }) =>
    setSearch(value);

  const searchSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    /**검색 데이터가 없을시 메인 페이지 reload*/
    if (!search) {
      return window.location.replace('/');
    }
    navigate(`/search`, { state: search });
  };

  const productMap = products?.map((country: Product) => {
    return <ProductCard key={country.productId} props={country} />;
  });

  return (
    <Main>
      <MainHeader />
      <SearchBar onSubmit={searchSubmit}>
        <SearchIcon color="disabled" />
        <SearchInput placeholder="상품을 검색하세요" onChange={handleChange} />
      </SearchBar>
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
