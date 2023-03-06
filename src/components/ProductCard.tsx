import { useState } from 'react';
import styled from 'styled-components';
import { Product } from '../page/Main';
import OrderModal from './OrderModal';

function ProductCard({ props }: { props: Product }) {
  const [modalOn, setModal] = useState(false);
  const clickHandle = () => {
    console.log('상품이 클릭되었습니다');
    setModal(true);
  };

  return (
    <ProductContainer>
      <ProductDiv onClick={clickHandle}>
        <ProductImage src={props.image} />
        <ProductName>{props.productName}</ProductName>
        <ProductPrice>₩{props.price.toLocaleString('ko-KR')}</ProductPrice>
      </ProductDiv>
      {modalOn && (
        <OrderModal product={props} closeModal={() => setModal(!modalOn)} />
      )}
    </ProductContainer>
  );
}

export default ProductCard;

const ProductContainer = styled.div``;

const ProductDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  width: 210px;
  &:hover {
    cursor: pointer;
  }
`;

const ProductImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
`;

const ProductName = styled.span``;
const ProductPrice = styled.span`
  font-size: 15px;
`;
