import { useEffect, useMemo, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { orderInstance } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MainHeader from '../components/Header';
import useIntersect from '../custom/intersection-observer.custom';
import { useFetchSearchProducts } from '../api/main-product-list';

export interface Product {
  productId: number;
  productName: string;
  price: number;
  image: string;
  stock: number;
}

function Search() {
  const [sumbMit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSerchParams] = useSearchParams();
  const search = searchParams.get('search');
  const price = searchParams.get('price');

  const { data, hasNextPage, isFetching, fetchNextPage, remove } =
    useFetchSearchProducts(search!, price || '0');

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

  const searchInputRef = useRef<HTMLInputElement>(null);

  const priceInputRef = useRef<HTMLInputElement>(null);

  const searchSubmit = async (event: any) => {
    setSubmit(true);
    event.preventDefault();
    const searchValue = searchInputRef.current!.value;
    const priceValue = priceInputRef.current!.value;
    /**검색 데이터가 없을시 메인 화면 출력 */
    if (!searchValue) return navigate(`/?price${priceValue || 0}`);
    remove();
    return navigate(`/search?search=${searchValue}&price=${priceValue || 0}`);
  };

  const priceSubmit = async (event: React.SyntheticEvent) => {
    setSubmit(true);
    event.preventDefault();
    const priceValue = priceInputRef.current!.value;
    const searchValue = searchInputRef.current!.value;
    /**검색 데이터가 없을시 메인 화면 출력 */
    if (!searchValue) return navigate(`/?price${priceValue || 0}`);
    remove();
    return navigate(`/search?search=${searchValue}&price=${priceValue || 0}`);
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
          <SearchInput
            defaultValue={search!}
            ref={searchInputRef}
            placeholder="상품을 검색하세요"
          />
        </SearchBar>
        <PriceInputSpan>가격: </PriceInputSpan>

        <PriceForm onSubmit={priceSubmit}>
          <PriceInput
            ref={priceInputRef}
            defaultValue={price || '0'}
            type="number"
          />
        </PriceForm>
      </SearchDiv>
      <ProductContainer>
        {products.length || sumbMit ? (
          productMap
        ) : (
          <NoData>{search}에 대한 검색결과가 없습니다</NoData>
        )}
        <Target ref={ref} />
      </ProductContainer>
    </Main>
  );
}
export default Search;

const NoData = styled.div`
  position: fixed;
  top: 40%;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.4);
`;

const PriceForm = styled.form``;

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

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
`;

const Target = styled.div`
  height: 1px;
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
    color: #c5c4c4;
  }
  &:focus {
    outline: none;
  }
`;
