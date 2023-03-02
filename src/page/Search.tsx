import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { orderInstance } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';

export interface Product {
  productId: number;
  productName: string;
  price: number;
  image: string;
  stock: number;
}

function Search() {
  const [products, setProduct] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const locationSearch = location.state;
  console.log(locationSearch);
  useEffect(() => {
    orderInstance
      .get(`search/${locationSearch}/1/0`)
      .then((response: AxiosResponse<Product[]>) => setProduct(response.data));
  }, []);

  const handleChange = ({ target: { value } }: { target: { value: string } }) =>
    setSearch(value);

  const searchSubmit = async (event: any) => {
    event.preventDefault();
    /**검색 데이터가 없을시 메인 데이터 출력 */
    if (!search) {
      const response = await orderInstance.get('main/1000/0');
      setProduct(response.data);
      return;
    }

    /** search/:상품이름/:가격/:상품ID */
    const response = await orderInstance.get(`search/${search}/1/0`);
    console.log(response);
    setProduct(response.data);
  };

  const productMap = products?.map((country: Product) => {
    return <ProductCard key={country.productId} props={country} />;
  });
  console.log(products);
  console.log(productMap);

  return (
    <Main>
      <SearchBar onSubmit={searchSubmit}>
        <SearchIcon color="disabled" />
        <SearchInput placeholder="상품을 검색하세요" onChange={handleChange} />
      </SearchBar>
      <ProductContainer>{products && productMap}</ProductContainer>
    </Main>
  );
}
export default Search;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: beige;
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
