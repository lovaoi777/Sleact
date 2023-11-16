import React, { useCallback, VFC } from 'react';
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
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  let { workspace } = useParams<{ workspace?: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  // const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  // const { mutate: mutateChannel } = useSWR<IChannel[]>(
  //   userData ? `/api/workspaces/${workspace}/channels` : null,
  //   fetcher,
  // );
  const onCreateChannel = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then((respone) => {
          mutateChannel(respone.data, false);
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel, workspace],
  );

  return (
    <div>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널 이름</span>
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
