import { ErrorResponse } from '@remix-run/router';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';

import { getCookie, removeCookie, setCookie } from './cookie';

//create an axios instance

/**주문서버 인스턴스 */
const orderInstance = axios.create({
  baseURL: 'http://charm10jo-goten.shop',
  timeout: 3000,
});

/**인증서버 인스턴스 */
const authInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 3000,
});

///////////////////////Order interceptor///////////////////////////
//요청 인터셉터 추가
orderInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //요청을 보내기 전에 수행할 로직
    const Token = getCookie('token');

    config.headers.set('authorization', `Bearer ${Token}`);
    config.headers.set('Content-Type', 'application/json; charset=utf-8');
    return config;
  },
  (error) => {
    //요청 에러가 발생했을 때 수행할 로직
    console.log(error); //디버깅
    return Promise.reject(error);
  },
);

//응답 인터셉터 추가
orderInstance.interceptors.response.use(
  (response) => {
    //응답에 대한 로직 작성

    console.log(response);
    return response;
  },

  (error) => {
    //응답 에러가 발생했을 때 수행할 로직
    const { data } = error.response;
    /**토큰 만료시 */
    if (data.statusCode == 401 && data.message == 'Unauthorized') {
      alert('로그인 만료');
      removeCookie('token');
      return window.location.replace('/login');
    }

    /**주문 재고 부족 */
    if (data.statusCode == 403 && data.message == '재고가 부족합니다') {
      /**OrderCard에서 예외처리 */
      return error.response;
    }

    return Promise.reject(error);
  },
);

///////////////////////Auth interceptor///////////////////////////
authInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //요청을 보내기 전에 수행할 로직
    const Token = getCookie('accessToken');
    //Token이 있을 때에만 헤더에 설정
    if (Token) {
      config.headers.set('authorization', `Bearer ${Token}`);
    }

    config.headers.set('Content-Type', 'application/json; charset=utf-8');
    return config;
  },
  (error) => {
    //요청 에러가 발생했을 때 수행할 로직
    console.log(error); //디버깅
    return Promise.reject(error);
  },
);

//응답 인터셉터 추가
authInstance.interceptors.response.use(
  (response) => {
    //응답에 대한 로직 작성
    if (response.data.accessToken) {
      const now = new Date();
      now.setHours(now.getHours() + 2);

      setCookie('token', response.data.accessToken, {
        expires: now,
      });
    }
    console.log(response);
    return response;
  },

  (error) => {
    //응답 에러가 발생했을 때 수행할 로직
    const { data } = error.response;
    if (
      (data.statusCode == 401 &&
        data.message == '가입되지 않은 이메일 입니다.') ||
      data.message == '이미 가입된 이메일 입니다'
    ) {
      return { data: { statusCode: data.statusCode, message: data.message } };
    }

    if (data.statusCode == 403 && data.message == '잘못된 비밀번호 입니다') {
      alert('비밀번호가 틀렸습니다');
    }
    console.log(error);
    return Promise.reject(error);
  },
);

export { orderInstance, authInstance };
