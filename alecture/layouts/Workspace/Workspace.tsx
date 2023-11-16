import React, { VFC, useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import { Navigate, Routes, Route, Link } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import Menu from '@components/Menu';
import { IChannel, IUser } from '@typings/db';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateChannelModal from '@components/CreateChannelModal';
import { useParams } from 'react-router';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import useSocket from '@hooks/useSocket';
// const Channel = loadable(() => import('@pages/Channel'));
// const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
  const [ShowUserMenu, setShowUserMenu] = useState(false);
  const [ShowCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setnewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setnewUrl] = useInput('');
  const [ShowWorkSpaceModal, setShowWorkSpaceModal] = useState(false);
  const [ShowCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [ShowInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [ShowInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const { data: MemberData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket, disconnect] = useSocket(workspace);
  useEffect(() => {
    console.log(socket);
    if (channelData && userData && socket) {
      socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData, userData]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        // revalidate();
        mutate(false, false);
      });
  }, []);
  const onClickUserProple = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);
  const toogleWorkspaceModal = useCallback(() => {
    setShowWorkSpaceModal((prev) => !prev);
  }, []);
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);
  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  const onCreateWorkSpace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidate();
          setnewWorkspace('');
          setnewUrl('');
          setShowCreateWorkspaceModal(false);
        })
        .catch((error) => {
          console.log(error.response.data);
          toast.error(error.response?.data, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        });
    },
    [newWorkspace, newUrl],
  );
  if (userData === undefined) {
    return null;
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <ToastContainer />
      <Header>
        <RightMenu>
          <span onClick={onClickUserProple}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'mp' })} alt={userData.email} />
            {ShowUserMenu && (
              <Menu style={{ right: '0px', top: '38px' }} show={ShowUserMenu} onCloseModal={onClickUserProple}>
                프로필메뉴
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'mp' })} alt={userData.email} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toogleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={ShowWorkSpaceModal} onCloseModal={toogleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃 </button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
            {channelData?.map((v) => {
              return <div>{v.name}</div>;
            })}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={ShowCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkSpace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
          </Label>
          <Button type="submit">생성하기 </Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={ShowCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={ShowInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={ShowInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
