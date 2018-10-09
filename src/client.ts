import Axios, { AxiosInstance, AxiosResponse, CancelToken } from 'axios';

const baseURL = 'https:/ghiejalfa/fndjkahjdf';
// const baseURL = 'https://us-central1-demoapp-1779c.cloudfunctions.net/v1';

const instance: AxiosInstance = Axios.create({
  baseURL,
  // HACK: 今回は，チャットサーバを用意していないため，タイムアウトの時間を少なくし，
  //         fetchMessagesのデフォルトメッセージを早期に表示するため
  timeout: 1000
});

export interface Message {
  id?: string;
  body?: string;
  user?: {
    id: string
    name: string
    avatar: string
  };
  date?: string;
}

export const fetchMessages = (channelName: string, params = {}, cancelToken: CancelToken = null): Promise<AxiosResponse<{ messages: Message[] }>> => {
  return instance.get(`/channels/${channelName}/messages`, {
    params,
    cancelToken
  });
};

export const postMessage = (channelName: string, payload: Message, cancelToken: CancelToken = null): Promise<AxiosResponse<Message>> => {
  return instance.post(`/channels/${channelName}/messages`, payload, {
    cancelToken
  });
};
