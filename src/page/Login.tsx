import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authInstance } from '../api/api';

interface LoginData {
  email: string;
  password: string;
}

function Login() {
  /**로그인정보 state */
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  /**유효성 state */
  const [validation, setValidate] = useState({
    email: false,
    password: false,
    msg: '',
  });

  const navigate = useNavigate();

  /**로그인 정보 서버에 전송후 토큰 세팅 */
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!validation.email || !validation.password) {
      setValidate({ ...validation, msg: '이메일 패스워드를 확인하세요' });
      return;
    }
    const response = await authInstance.post('/auth/login', loginData);
    if (response.data.statusCode == 401) {
      setValidate({ ...validation, msg: '가입되지 않은 이메일 입니다.' });
      return;
    }
    //쿠키 저장 로직
    navigate('/');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = event.target;

    /**이메일 유효성 검사 */
    if (type == 'email') {
      const isValidEmail = value.includes('@') && value.includes('.');
      /**유효성 상태 저장 */
      setValidate({ ...validation, email: isValidEmail });
    }

    /**패스워드 유효성 검사 */
    if (type == 'password') {
      const isValidPassword = value.search(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/,
      );
      /**유효성 상태 저장 */
      setValidate({ ...validation, password: !isValidPassword });
    }

    /**로그인 데이터 저장 */
    setLoginData({ ...loginData, [type]: value });
  };

  /**회원가입 화면 이동 */
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <LoginMain>
      <Background>
        <LoginDiv>
          <LoginForm onSubmit={handleSubmit}>
            <InputDiv>
              <LoginLabel>Email</LoginLabel>
              <LoginlInput type="email" onChange={handleChange} />
              {loginData.email && !validation.email && (
                <ValidateEmail>이메일 형식을 확인해 주세요</ValidateEmail>
              )}
            </InputDiv>
            <InputDiv>
              <LoginLabel>Password</LoginLabel>
              <LoginlInput type="password" onChange={handleChange} />
              {loginData.password && !validation.password && (
                <Validate>
                  비밀번호는 8자이상 문자, 숫자, 특수문자가 포함 되어야 합니다.
                </Validate>
              )}
            </InputDiv>

            <LoginButton type="submit">로그인</LoginButton>
            <SignupButton onClick={handleSignup}>회원가입</SignupButton>
            {validation.msg && (
              <Validate className="validate">{validation.msg}</Validate>
            )}
          </LoginForm>
        </LoginDiv>
      </Background>
    </LoginMain>
  );
}
export default Login;

const LoginMain = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('market.jpg');
  background-size: cover;
`;

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.425);
`;

const LoginDiv = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;
const LoginForm = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  background-color: white;
  align-items: center;
  border: none;
  border-radius: 15px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 1);
  margin-bottom: 30px;
  padding: 30px 10px 50px 10px;
  width: 250px;
`;

const InputDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-bottom: 15px;
  /* &:first-child {
    
  } */
`;
const LoginLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #33333399;
`;
const LoginlInput = styled.input`
  border: none;
  border-bottom: solid 1px #333333;
  &:focus {
    outline: none;
  }
`;

const Validate = styled.span`
  position: absolute;
  bottom: -28px;
  font-size: 10px;
  color: red;
  &.validate {
    bottom: 10px;
  }
`;

const ValidateEmail = styled.span`
  position: absolute;
  bottom: -14px;
  font-size: 10px;
  color: red;
`;

const LoginButton = styled.button`
  width: 150px;
  height: 30px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  border-radius: 10px;
  background-color: tomato;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin: 40px 0px 10px 0px;
  &:hover {
    background-color: #ff2600;
    cursor: pointer;
  }
`;
const SignupButton = styled.button`
  width: 150px;
  height: 30px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  border-radius: 10px;
  background-color: #858585;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: #ff2600;
    cursor: pointer;
  }
`;
