import useInput from '@hooks/useInput';
import React, { useState, useCallback } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Login = () => {
  //로그인 후 데이터를 전해줄 API
  //fetcher 는 주소를 어떻게 처리할지 정의것   (data : return , error == 400 , loading}
  //swr이 1. 원활때 서버에 호출하기 (revalidate )  2. 시간 당으로 호춣하기
  //swr , mutate는 서버로 부터 요청을 안보내고 데이터를 수정하는것
  //주기적으로ㅓ 호출 dedupingInterval
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [logInError, setlogInError] = useState(false);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setlogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((res) => {
          mutate(res.data, false);
        })
        .catch((error) => {
          setlogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );
  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (!error && data) {
    console.log('로그인됨', data);
    return <Navigate to="/workspace/channel" />;
  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
