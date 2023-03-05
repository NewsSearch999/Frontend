import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import styled from 'styled-components';

function TopButton() {
  const topHandle = (event: React.MouseEvent<HTMLElement>) => {
    if (!window.scrollY) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <ButtonDiv onClick={topHandle}>
      <KeyboardArrowUpIcon fontSize="large"></KeyboardArrowUpIcon>
    </ButtonDiv>
  );
}

export default TopButton;

const ButtonDiv = styled.div`
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  color: rgba(0, 0, 0, 0.8);
  background-color: rgba(121, 121, 121, 0.2);
  &:hover {
    cursor: pointer;
  }
`;
