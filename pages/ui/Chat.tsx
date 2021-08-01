import styled from 'styled-components';
import { MessageSquare } from 'react-feather';
import React, { useEffect, useRef, useState } from 'react';
import { getCanvasController } from '../controller/CanvasController';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../store';

const ChatButton = styled.div`
  position: fixed;
  bottom: 10px;
  right: 50px;
  font-size: 1rem;
  height: 35px;
  width: 35px;

  background-color: #FFFD;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #FFFA;
  }
`;
const ChatWindow = styled.div<{show: boolean}>`
  position: fixed;
  bottom: 50px;
  right: 50px;
  font-size: 1rem;
  height: 200px;
  width: 300px;
  max-width: 80vw;

  background-color: #FFFD;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: .8rem;

  ${({ show }) => !show && `
    opacity: 0;
  `}
`;
const ChatText = styled.div`
  height: 85%;
  padding: 5px;
  box-sizing: border-box;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;
const ChatInteraction = styled.div`
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 5px;
  input {
    width: 80%;
  }
`;
const ChatMessage = styled.div`
  span {
    color: crimson;
  }
`;
const SendButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border: 1px solid #777;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background-color: #EEE;
  }
`;

export default function Chat() {
  const [showMessages, setShowMessages] = useState(false);
  const [message, setMessage] = useState('');
  const messageList = useSelector((state: ReduxState) => state.chatMessages);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = () => {
    setMessage('');
    getCanvasController()?.connectionController.sendToWs('sendMessage', message);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <>
      <ChatButton onClick={() => setShowMessages(!showMessages)}>
        <MessageSquare height="20px"/>
      </ChatButton>
      <ChatWindow show={showMessages}>
        <ChatText ref={chatRef}>
          {messageList.map((msg, i) => (
            <ChatMessage key={i}>
              <span>
                {msg.author}
              </span>
              : {msg.msg}
            </ChatMessage>
          ))}
        </ChatText>
        <ChatInteraction>
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter")
                sendMessage();
            }}
          />
          <SendButton onClick={sendMessage}>
            Send
          </SendButton>
        </ChatInteraction>
      </ChatWindow>
    </>
  );
}