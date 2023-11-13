import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import Workspace from '@layouts/Workspace/Workspace';
import ChatBox from '@components/ChatBox';
import ChannelList from '@components/ChannelList';
import useInput from '@hooks/useInput';
const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      <ChannelList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
