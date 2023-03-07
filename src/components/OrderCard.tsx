import styled from 'styled-components';
import Swal from 'sweetalert2';
import { orderInstance } from '../api/api';
import { Order } from '../page/Myorder';

function OrderCard({ props }: { props: Order }) {
  const payHandle = async () => {
    const response = await orderInstance.put(`/orders/${props.orderId}`);
    if (response.data.message == '재고가 부족합니다') {
      return Swal.fire({
        icon: 'warning',
        title: '재고가 부족합니다.',
      });
    }
    Swal.fire({
      icon: 'success',
      title: '결제가 처리중입니다.',
      text: '잠시 기다려 주세요.',
    });
    window.location.reload();
  };
  return (
    <OrderDiv>
      <ImageSpace>
        <ProductImage src={props.image} />
      </ImageSpace>
      <ProductName>{props.productName}</ProductName>
      <ProductPrice>₩{props.price.toLocaleString('ko-KR')}</ProductPrice>
      <ProductStock>{props.stock}</ProductStock>
      <OrderQuantity>주문수량:{props.quantity}</OrderQuantity>
      <ProductStock>{props.orderState}</ProductStock>
      <ProductStock>{props.deliveryState}</ProductStock>
      <PaySpan>
        ₩{(props.price * props.quantity).toLocaleString('ko-KR')}
      </PaySpan>
      {props.orderState == '결제완료' ? (
        <PayButtonSapce></PayButtonSapce>
      ) : (
        <PayButton onClick={payHandle}>결제하기</PayButton>
      )}
    </OrderDiv>
  );
}

export default OrderCard;

const OrderDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: solid 2px #1a1a1a28;
  padding-bottom: 5px;
  width: 80%;
  height: 50px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
`;

const ImageSpace = styled.div`
  display: flex;
  width: 100px;
  justify-content: center;
`;

const ProductName = styled.span`
  display: flex;
  width: 200px;
  justify-content: center;
`;

const ProductPrice = styled.span`
  font-size: 15px;
  display: flex;
  width: 200px;
  justify-content: center;
`;

const OrderQuantity = styled.span`
  font-size: 13px;
  display: flex;
  width: 150px;
  justify-content: center;
`;

const PayButton = styled.button`
  display: flex;
  font-size: 13px;
  width: 75px;
  background-color: #383838;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 3px;
  border: solid 1px rgb(27, 27, 27);

  justify-content: center;
  &:hover {
    cursor: pointer;
    background-color: tomato;
    border: solid 1px tomato;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  &:active {
    background-color: tomato;
  }
`;

const PayButtonSapce = styled.div`
  display: flex;
  width: 75px;
  background-color: white;
`;

const PaySpan = styled.span`
  display: flex;
  width: 200px;
  justify-content: center;
`;

const ProductStock = styled.span`
  display: flex;
  width: 100px;
  justify-content: center;
`;
