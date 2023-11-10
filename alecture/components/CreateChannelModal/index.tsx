import React, { useState, useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (fleg: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  let { workspace } = useParams<{ workspace?: string }>();
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
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
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannel();
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((error) => toast.error(error?.data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 }));
    },
    [newChannel],
  );

  return (
    <div>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널</span>
            <Input id="channel " value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button type="submit">생성하기 </Button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CreateChannelModal;
