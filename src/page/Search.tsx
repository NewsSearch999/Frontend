import { useEffect, useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { orderInstance } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [search, setSearch] = useState('');
  const [sumbMit, setSubmit] = useState({ display: 0, search: '' });
  const [products, setProduct] = useState<Product[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const locationSearch = location.state;

  const { data, hasNextPage, isFetching, fetchNextPage } =
    useFetchSearchProducts(sumbMit.search ? sumbMit.search : locationSearch);

  useEffect(() => {
    console.log('useEffect');

    setProduct(
      useMemo(
        () => (data ? data.pages.flatMap(({ data }) => data) : []),
        [data],
      ),
    );
  }, [data]);
  /**상품데이터 */

  const ref = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      console.log(data);
      console.log('hasNextPage');
      console.log(hasNextPage);
      console.log('isFetching');
      console.log(isFetching);
      console.log('fetchNextPage');
      console.log(fetchNextPage);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: '0px 0px 500px 0px' },
  );

  const handleChange = ({ target: { value } }: { target: { value: string } }) =>
    setSearch(value);

  const searchSubmit = async (event: any) => {
    event.preventDefault();
    /**검색 데이터가 없을시 메인 화면 출력 */
    console.log('제출됨');
    if (!search) return navigate('/');
    /**데이터 로딩시 화면유무 */
    setSubmit({ search: search, display: 1 });
    // const options = { cancelRefetch: true, pageParam: {} };
    // fetchNextPage(options);
    // navigate('/search', { state: search });
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
        {products.length || sumbMit.display ? (
          productMap
        ) : (
          <NoData>{locationSearch}에 대한 검색결과가 없습니다</NoData>
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
