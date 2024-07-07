import React, { useEffect, useRef, useState } from 'react';
import './App.css';

type Message = { // 型定義
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]); // メッセージ一覧
  const [inputMessage, setInputMessage] = useState(''); // 入力メッセージ
  const ws = useRef<WebSocket | null>(null); // 接続管理

  useEffect(() => {
    ws.current = new WebSocket('wss://chat-express-zpxu.onrender.com/ws'); // WebSocket

    ws.current.onopen = () => { // 接続が開始されたら
      console.log('WebSocket connection established');
    };
    ws.current.onmessage = (event) => { // メッセージを受け取ったとき
      const newMessage: Message = { text: event.data };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // 新しいメッセージを追加
    };

    return () => { // WebSocket通信を終了する
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => { // メッセージを送信
    e.preventDefault(); // リロード阻止
    if (inputMessage.trim() !== '' && ws.current) { // メッセージが入力されてたら
      ws.current.send(inputMessage); // メッセージを送る
      setInputMessage(''); // 入力を消す
    }
  };

  return (
    <div className="App">
      <h1>WebSocket Chat</h1>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="メッセージを入力..."
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}

export default App;