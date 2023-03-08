import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authInstance } from '../api/api';
import { getCookie } from '../api/cookie';
import MainHeader from '../components/Header';
import { Toast } from './Login';

interface SignupData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

function Signup() {
  /**회원가입 정보 state */
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  /**유효성 state */
  const [validation, setValidate] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    msg: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      Toast.fire({
        icon: 'warning',
        title: '이미 로그인 되어있습니다',
      });
      navigate('/');
    }
  }, []);

  /**회원가입 정보 서버에 전송후 로그인*/
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!validation.email || !validation.password) {
      setValidate({ ...validation, msg: '이메일 패스워드를 확인하세요' });
      return;
    }
    const response = await authInstance.post('/auth/signup', signupData);
    if (response.data.ok == true) {
      Toast.fire({
        icon: 'success',
        title: '회원가입 완료',
      });
      navigate('/login');
    } else {
      setValidate({ ...validation, msg: '이미 가입된 이메일 입니다.' });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    /**이메일 유효성 검사 */
    if (name == 'email') {
      const isValidEmail = value.includes('@') && value.includes('.');

      /**유효성 상태 저장 */
      setValidate({ ...validation, email: isValidEmail });
    }

    /**패스워드 유효성 검사 */
    if (name == 'password') {
      const isValidPassword = value.search(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/,
      );
      /**유효성 상태 저장 */
      setValidate({ ...validation, password: !isValidPassword });
    }

    /**패스워드 재확인 체크 */
    if (name == 'passwordConfirm') {
      const isValidConfirm = value == signupData.password;
      /**유효성 상태 저장 */
      setValidate({ ...validation, passwordConfirm: isValidConfirm });
    }

    /**로그인 데이터 저장 */
    setSignupData({ ...signupData, [name]: value });
  };

  /**회원가입 화면 이동 */
  const handleSignup = () => {};

  return (
    <LoginMain>
      <Background>
        <MainHeader />
        <LoginDiv>
          <LoginForm onSubmit={handleSubmit}>
            <InputDiv>
              <LoginLabel>Email</LoginLabel>
              <LoginlInput type="email" name="email" onChange={handleChange} />
              {signupData.email && !validation.email && (
                <Validate2>이메일 형식을 확인해 주세요</Validate2>
              )}
            </InputDiv>
            <InputDiv>
              <LoginLabel>Password</LoginLabel>
              <LoginlInput
                type="password"
                name="password"
                onChange={handleChange}
              />
              {signupData.password && !validation.password && (
                <Validate>
                  비밀번호는 8자이상 문자, 숫자, 특수문자가 포함 되어야 합니다.
                </Validate>
              )}
            </InputDiv>
            <InputDiv className="password-confirm">
              <LoginLabel>Confirm Password</LoginLabel>
              <LoginlInput
                name="passwordConfirm"
                type="password"
                onChange={handleChange}
              />
              {signupData.passwordConfirm && !validation.passwordConfirm && (
                <Validate2>비밀번호가 일치하지 않습니다.</Validate2>
              )}
            </InputDiv>
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
export default Signup;
const LoginMain = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('market.jpg');
  background-size: cover;
`;

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.24);
`;

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;
const LoginForm = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 15px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 1);
  margin-bottom: 30px;
  padding: 30px 10px 50px 10px;
  width: 250px;
  background-color: white;
`;

const InputDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-bottom: 15px;
  &.password-confirm {
    margin-top: 18px;
  }
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

const Validate2 = styled.span`
  position: absolute;
  bottom: -14px;
  font-size: 10px;
  color: red;
`;

const SignupButton = styled.button`
  width: 150px;
  height: 30px;
  border: none;
  margin-top: 50px;
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
