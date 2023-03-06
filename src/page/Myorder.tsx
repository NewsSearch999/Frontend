import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { orderInstance } from '../api/api';
import { getCookie } from '../api/cookie';
import MainHeader from '../components/Header';
import OrderCard from '../components/OrderCard';
import TopButton from '../components/TopButton';

export interface Order {
  orderId: number;
  quantity: number;
  price: number;
  orderState: string;
  deliveryState: string;
  createdAt: Date;
  stock: number;
  productName: string;
  image: string;
}

export function Myorder() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      alert('로그인후 이용가능 합니다');
      navigate('/');
      return;
    }

    orderInstance
      .get('orders')
      .then((response: AxiosResponse<Order[]>) => setOrders(response.data));
  }, []);

  const ordersMap = orders?.map((orderData) => {
    return <OrderCard props={orderData} key={orderData.orderId} />;
  });

  return (
    <MyorderDiv>
      <MainHeader />
      <OrderContainer>
        <OrderHeader>
          <Span100>상품이미지</Span100>
          <Span200>상품명</Span200>
          <Span200>가격</Span200>
          <Span100>재고</Span100>
          <Span150>주문 수량</Span150>
          <Span100>주문상태</Span100>
          <Span100>배송상태</Span100>
          <Span200>결제금액</Span200>
          <PayButton></PayButton>
        </OrderHeader>
        {orders && ordersMap}
      </OrderContainer>
      <TopButton />
    </MyorderDiv>
  );
}

const MyorderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const OrderContainer = styled.div`
  padding-top: 30px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const OrderHeader = styled.header`
  display: flex;
  width: 80%;
  height: 30px;
  background-color: #ffffff;
  border-bottom: solid 2px gray;
  margin-bottom: 5px;
  justify-content: space-around;
`;

const spanCss = css`
  display: flex;
  justify-content: center;
`;

const Span100 = styled.span`
  ${spanCss}
  width: 100px;
`;
const Span200 = styled.span`
  ${spanCss}
  width: 200px;
`;

const Span150 = styled.span`
  ${spanCss}
  width: 150px;
`;

const PayButton = styled.span`
  ${spanCss}
  width: 75px;
`;
