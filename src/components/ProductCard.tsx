import { useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../page/Main';

function ProductCard({ props }: { props: Product }) {
  return (
    <ProductDiv>
      <ProductImage src={props.image} />
      <ProductName>{props.productName}</ProductName>
      <ProductPrice>₩{props.price.toLocaleString('ko-KR')}</ProductPrice>
      <ProductStock>남은수량:{props.stock}</ProductStock>
    </ProductDiv>
  );
}

export default ProductCard;

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

const ProductStock = styled.span`
  font-size: 13px;
  padding-left: 110px;
`;
