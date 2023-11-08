import React, { FC, useState, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
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
import { IUser } from '@typings/db';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Workspace: FC = ({ children }) => {
  const [ShowUserMenu, setShowUserMenu] = useState(false);
  const [ShowCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setnewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setnewUrl] = useInput('');
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
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
  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
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
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
      <Modal show={ShowCreateWorkspaceModal} onCloseModal={onClickCreateWorkSpace}>
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
    </div>
  );
};

export default Workspace;
