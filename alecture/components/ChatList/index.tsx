import React, { VFC } from 'react';
import { ChatZone } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((chat) => {
          return <Chat key={chat.id} data={chat} />;
        })}
      </div>
    </ChatZone>
  );
};

export default ChatList;
