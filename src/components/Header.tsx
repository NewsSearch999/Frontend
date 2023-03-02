import { useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function MainHeader() {
  const navigate = useNavigate();

  const login = () => {
    navigate('/login');
  };
  const logoClick = () => {
    navigate('/');
  };
  return (
    <Header>
      <LogoDiv onClick={logoClick}>Shopping Search</LogoDiv>
      <LoginButton onClick={login}>Login</LoginButton>
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

const LoginButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 20px;
  border: none;
  margin-right: 20px;
  box-shadow: 1px 4px 0 rgb(0, 0, 0, 0.5);
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
