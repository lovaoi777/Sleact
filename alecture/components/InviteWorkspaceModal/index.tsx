import React, { FC, useCallback } from 'react';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import { useParams } from 'react-router';
import workspace from '@layouts/Workspace/Workspace';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (fleg: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const [newMember, onChangeNewMember, setnewMember] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data: channelData, revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannel();
          setnewMember('');
          setShowInviteWorkspaceModal(false);
        })
        .catch((error) => {
          toast.error(error?.data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 });
        });
    },
    [newMember],
  );
  return (
    <div>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default InviteWorkspaceModal;
