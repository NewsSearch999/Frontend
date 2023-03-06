import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderInstance } from '../api/api';
import { Product } from '../page/Main';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';

interface props {
  closeModal: () => void;
  product: Product;
}

function OrderModal(props: props) {
  const { product } = props;
  const [quantity, setQuantity] = useState('0');
  const quantityHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // value의 값이 숫자가 아닐경우 빈문자열로 replace 해버림.
    const onlyNumber = value.replace(/[^0-9]/g, '');
    if (3 < onlyNumber.length) return;

    setQuantity(onlyNumber);
  };
  const navigate = useNavigate();
  /**주문 생성 */
  const orderSubmit = async () => {
    if (!+quantity) {
      alert('수량을 입력해주세요');
      return;
    }
    const response = await orderInstance.post('/orders', {
      productId: product.productId,
      quantity: quantity,
    });
    if (response.status == 201) {
      setQuantity('0');
      navigate('/myorders');
    }
  };

  useEffect(() => {
    console.log(props.product);
  }, []);
  const closeModal = () => {
    console.log('modal close');
    props.closeModal();
  };
  return (
    <Background>
      <Modaldiv>
        {/* X아이콘 CSS는 App.css에 정의 */}
        <CloseIcon id="close-button" onClick={closeModal} />
        <ProductImage src={product.image}></ProductImage>
        <OrderDiv>
          <ProductName>{product.productName}</ProductName>
          <ProductPrice>₩{product.price.toLocaleString('ko-KR')}</ProductPrice>
          <ProductStock>재고: {product.stock}</ProductStock>
          <QuantityDiv>
            주문수량:
            <OrderQuantity
              onChange={quantityHandle}
              type="number"
              min="1"
              max="1000"
              value={quantity}
            ></OrderQuantity>
          </QuantityDiv>

          <OrderButton onClick={orderSubmit}>주문하기</OrderButton>
        </OrderDiv>
      </Modaldiv>
    </Background>
  );
}

export default OrderModal;

const Modaldiv = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 30%;
  font-weight: 100px;
  font-size: 30px;
  padding: 5px;
  width: 500px;
  height: 300px;
  background-color: #ffffff;
`;

const OrderDiv = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: */
  flex-direction: column;
`;

const ProductName = styled.span`
  padding-bottom: 70px;
`;
const ProductPrice = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;
const ProductStock = styled.span`
  font-size: 15px;
`;

const QuantityDiv = styled.span`
  font-size: 15px;
`;
const OrderQuantity = styled.input`
  width: 40px;
  margin-left: 10px;
  &:focus-within {
    border: none;
  }
`;
const OrderButton = styled.button`
  background-color: #272727;
  color: white;
  width: 100px;
  height: 30px;
  margin-top: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  padding: 20px;
  margin-right: 20px;
  width: 250px;
  height: 250px;
`;
