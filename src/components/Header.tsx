import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { getCookie, removeCookie } from '../api/cookie';

function MainHeader() {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(false);
  const location = useLocation();
  const Login = location.state;

  useEffect(() => {
    console.log(Login);
    const token = getCookie('token');
    if (token) {
      setLogin(true);
    }
  }, [Login]);

  /**로그인 핸들러 */
  const login = () => {
    navigate('/login');
  };

  /**로그아웃 핸들러 */
  const logout = () => {
    removeCookie('token');
    setLogin(false);
    navigate('/');
    alert('로그아웃 되었습니다');
  };

  /**로고 클릭 핸들러 */
  const logoClick = () => {
    navigate('/');
  };

  const myOrders = () => {
    navigate('/myorders');
  };
  return (
    <Header>
      <LogoDiv onClick={logoClick}>Shopping Search</LogoDiv>
      {isLogin ? (
        <ButtonDiv>
          <MyorderButton onClick={myOrders}>MyOrders</MyorderButton>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </ButtonDiv>
      ) : (
        <LoginButton onClick={login}>Login</LoginButton>
      )}
    </Header>
  );
}

export default MainHeader;

const LogoDiv = styled.div`
  margin-left: 20px;
  font-weight: 100px;
  font-size: 30px;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: tomato;
`;

const ButtonDiv = styled.div`
  display: flex;
`;
export const ButtonCss = css`
  width: 80px;
  height: 30px;
  border-radius: 20px;
  border: none;
  margin-right: 20px;
  box-shadow: 1px 4px 0 rgb(0, 0, 0, 0.5);
`;

const ButtonEvent = css`
  &:hover {
    cursor: pointer;
  }
  &:active {
    box-shadow: 1px 1px 0 rgb(0, 0, 0, 0.5);
    position: relative;
    top: 2px;
  }
`;
const LoginButton = styled.button`
  ${ButtonCss}
  &:hover {
    background-color: #2e2a2a;
    color: white;
    cursor: pointer;
  }
  &:active {
    box-shadow: 1px 1px 0 rgb(0, 0, 0, 0.5);
    position: relative;
    top: 2px;
  }
`;

const LogoutButton = styled.button`
  ${ButtonCss}
  background-color: #000000;
  color: white;
  ${ButtonEvent}
`;

const MyorderButton = styled.button`
  ${ButtonCss}
  ${ButtonEvent}
`;
