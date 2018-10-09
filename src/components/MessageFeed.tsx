import * as React from 'react';
import { fetchMessages, Message } from '../client';
import { Dimmer, Loader, Segment, Image, Comment, Header } from 'semantic-ui-react';
import Axios, { CancelToken, CancelTokenSource } from 'axios';

interface MessageFeedProps {
  channelName: string;
  shouldReload: boolean;
  setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFeedState {
  messages: Message[];
  isLoading?: boolean;
}

export class MessageFeed extends React.Component<MessageFeedProps, MessageFeedState> {
  private cancelTokenSource: CancelTokenSource;

  constructor(props: MessageFeedProps) {
    super(props);
    this.state = {
      messages: [],
      isLoading: false
    };
    this.cancelTokenSource = null;
  }

  public render() {
    if(this.state.isLoading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <Segment basic>
        <Comment.Group>
          <Header as='h3' dividing>{this.props.channelName}</Header>
          {this.state.messages.slice().reverse().map(message => (
            <Comment key={message.id}>
              <Comment.Avatar src={message.user.avatar || '/img/avatar.png'} />
              <Comment.Content>
                <Comment.Author as='a'>@{message.user.name}</Comment.Author>
                <Comment.Metadata>
                  <div>{message.date}</div>
                </Comment.Metadata>
                <Comment.Text>
                  {message.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    );
  }

  private fetchMessages = (channelName: string) => {
    this.props.setShouldReload(false);

    this.setState({ isLoading: true });

    this.cancelTokenSource = Axios.CancelToken.source();
    fetchMessages(channelName, {}, this.cancelTokenSource.token)
      .then(responce => {
        this.setState({ messages: responce.data.messages });
      })
      .catch(err => {
        // console.log(err);
        if(Axios.isCancel(err)) {
          console.log(err);
        } else {
          // HACK: 今回は，チャットサーバを用意していないため，errorが起こる仕様を
          //          を利用して，サンプルメッセージを生成
          const messages: Message[] = [
            {
              'id': '2',
              'body': 'you send a some message',
              'user': {
                'id': 'robot',
                'name': 'Robot',
                'avatar': '',
              },
              'date': `${(new Date()).toJSON()}`,
            },
            {
              'id': '1',
              'body': `welcome to #${channelName} channel!!`,
              'user': {
                'id': 'robot',
                'name': 'Robot',
                'avatar': '',
              },
              'date': `${(new Date()).toJSON()}`,
            },
          ];

          this.setState({
            messages: messages,
            isLoading: false
          });
        }
      });
  }

  public componentDidMount() {
    this.fetchMessages(this.props.channelName);
  }

  public componentWillMount() {
    if(this.cancelTokenSource) {
      this.cancelTokenSource.cancel('This component has been unmounted');
    }
  }

  public componentDidUpdate(prevProps: MessageFeedProps) {
    if(prevProps.channelName !== this.props.channelName ||
         !prevProps.shouldReload && this.props.shouldReload) {
      this.fetchMessages(this.props.channelName);
    }
  }
}
