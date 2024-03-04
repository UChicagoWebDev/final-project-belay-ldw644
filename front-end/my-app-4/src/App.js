import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { HashRouter as BrowserRouter, Route, useHistory, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

var API_KEY = Cookies.get('dingwei_api_key');

const API_ADDRESS = 'http://localhost:5000/api'
// const API_KEY = '31a3ff6a-6061-4de5-b2e0-4191a24af813'
function useLogin() {
  const login = () => {
  };

  return login;
}

function Splash() {
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channels, setChannels] = useState([]);
  const [columnStyle, setColumnStyle] = useState(['splash-two']);
  const [inputReply, setInputReply] =useState([]);
  const [replies, setReplies] = useState([]);
  let {channel_id, message_id} = useParams();
  const history = useHistory();
  if(!API_KEY) history.push("/login",{from: window.location.pathname});
  // if(!channel_id) history.push("/channel/1");
  // setColumnStyle('splash-three');

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleInputReplyChange = (event) => {
    setInputReply(event.target.value);
  };
  
  

  const handleClick = (channelId) => {
    setMessages();
    history.push(`/channel/${channelId}`);
  }

  const close = () => {
    history.push(`/channel/${channel_id}`)
  }

  const goReply = (id) => {
    history.push(`/channel/${channel_id}/replies/${id}`);
  };

  const sendMessage = () => { 
    if (inputMessage === "") return;
    const params = new URLSearchParams();
    params.append('body', inputMessage);
    params.append('channel_id', channel_id);
    fetch(API_ADDRESS + `/messages/post`,{
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})

    setInputMessage('');
  }


  const sendReply = () => {
    if (inputReply === "") return;
    const params = new URLSearchParams();
    params.append('body', inputReply);
    params.append('message_id', message_id);
    fetch(API_ADDRESS + `/replies/post`,{
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})

    setInputReply('');
  }
  
  let message_last_id = 0;
  let reply_last_id = 0;
  const [channel_name, setChannelName] = useState([]);
  const [oneMessage, setOneMessage] = useState([]);
  useEffect(() => {
    if(message_id) {
      setColumnStyle("splash-three");
      fetch(API_ADDRESS + `/messages/get_one?message_id=${message_id}`, {
        headers: {
          'Authorization': API_KEY,
        }
      })
      .then(response => response.json())
      .then(data => {
        setOneMessage(data.message);
      })

      fetch(API_ADDRESS + `/replies/get?message_id=${message_id}&last_id=${reply_last_id}`, {
        headers: {
          'Authorization': API_KEY,
        }
      })
      .then(response => response.json())
      .then(data => {
        setReplies(data.replies);
      })
    } else {
      setColumnStyle("splash-two");
    }
  }, [message_id])

  const [unread, setUnread] = useState([]);

  useEffect(() => {
    const fetchUnread = () => {fetch(API_ADDRESS + '/channels/unread', {
      headers: {
        'Authorization': API_KEY,
      }
    })
    .then(response => response.json())
    .then(data => {
      setUnread(data.unread);
    })};
    // fetchUnread();
    const intervalId = setInterval(fetchUnread, 1000);
    return () => clearInterval(intervalId);
  }, [unread])

  const messageLastId = useRef(0);

  useEffect(() => {
    if (!channel_id) return;

    const fetchMessages = () => {
      fetch(`${API_ADDRESS}/messages/get?channel=${channel_id}&last_id=${messageLastId.current}`, {
        headers: {
          'Authorization': API_KEY,
        }
      })
      .then(response => response.json())
      .then(data => {
        setChannelName(data.channel_name);
        if (data.messages) {
          setMessages(prevMessages => [...prevMessages, ...data.messages]);
          messageLastId.current = data.messages[data.messages.length - 1].id;
        }
      });
    };
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [channel_id]);

  const goSplash = () => {
    history.push("/");
  }
  useEffect(() => {
    fetch(API_ADDRESS + '/channels/get',{
      headers: {
        'Authorization': API_KEY,
      }
    })
    .then(response => response.json())
    .then(data => {
      setChannels(data.channels);
    })
  }, []);

  const [emojiText, setEmojiText] = useState([]);
  const [replyEmojiText, setReplyEmojiText] = useState([]);

  const handleHoverEmoji = (event) => {
    let emoji_message_id = event.target.attributes.message_id.value;
    let emoji = event.target.id;

    fetch(API_ADDRESS + `/messages/reactions/get?message_id=${emoji_message_id}&emoji=${emoji}`,{
    headers: {
      'Authorization': API_KEY,
    },
    })
    .then(response => response.json())
    .then(data => {
      if (data.reaction_text) setEmojiText(data.reaction_text);
      else setEmojiText("");
      console.log(data.reaction_text);
    })
  }

  const handleHoverReplyEmoji = (event) => {
    let emoji_reply_id = event.target.attributes.reply_id.value;
    let emoji = event.target.id;

    fetch(API_ADDRESS + `/replies/reactions/get?reply_id=${emoji_reply_id}&emoji=${emoji}`,{
    headers: {
      'Authorization': API_KEY,
    },
    })
    .then(response => response.json())
    .then(data => {
      if (data.reaction_text) setReplyEmojiText(data.reaction_text);
      else setReplyEmojiText("");
      console.log(data.reaction_text);
    })
  }

  

  const handleClickEmoji = (event) => {
    const params = new URLSearchParams();
    params.append('message_id', event.target.attributes.message_id.value);
    params.append('emoji', event.target.id);
    params.append('display', true);

    fetch(API_ADDRESS + '/messages/reactions/post',{
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
  }

  const handleClickReplyEmoji = (event) => {
    const params = new URLSearchParams();
    params.append('reply_id', event.target.attributes.reply_id.value);
    params.append('emoji', event.target.id);
    params.append('display', true);

    fetch(API_ADDRESS + '/replies/reactions/post',{
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
  }

  return (
    <div className={columnStyle}>
      <div className="left">
        <div className="workspace-name">
          <b>UChicago CS</b>
        </div>
        <div className="channels">
          <div className='channels-text'>
            {/* CHANNELS */}
            {channels && channels.map((channel, index) => (
              <div className={Number(channel_id) === Number(channel.id) ? "selected-channel" : "channel"} key={channel.id} onClick={() => handleClick(channel.id)}># {channel.name}</div>
            ))} 
          </div>
          <div className='unreads'>
          {unread && unread.map((unr, index) => (
            <div>
            {unr.unread_messages_count === 0 || channel_id === index+1 ? "" : unr.unread_messages_count}
            {/* {unr.unread_messages_count} */}
            </div>
          ))}
          </div>
        </div>
        
        <div className='me'>
          <button onClick={() => {history.push("/profile")}}>MyProfile</button>
        </div>
      </div>

      {channel_id && (
      <div className="middle">
        
        <div className="channel-name"><button className='back' onClick={goSplash}>&lt;</button><b> # {channel_name}</b></div>
        <div className="messages-container">
          {/* MESSAGES */}
          {messages && messages.map((message, index) => (
            <div className="message" key={message.id}>
              <div className="message-content">
                <div className="message-user-time">
                  <div className="message-user">{message.name}</div>
                </div>
                <div className="message-text">
                  {message.body}
                </div>
                <div className="replies-avatar-container">
                  <div className="replies-amount" onClick={() => goReply(message.id)}>{message.replies_num === 0 ? 'Reply' : message.replies_num === 1 ? `1 Reply` : `${message.replies_num} Replies`}
                  </div>
                  
                    <div className="emoji-container">
                      <button id="smile" message_id={message.id} data-emoji="smile" onClick={handleClickEmoji} onMouseOver={handleHoverEmoji}>😊</button>
                      <span class="tooltip">Clicked: {emojiText}</span>
                    </div>
                    
                    <div className="emoji-container">
                      <button id="sad" message_id={message.id} data-emoji="sad" onClick={handleClickEmoji} onMouseOver={handleHoverEmoji}>😢</button>
                      <span class="tooltip">Clicked: {emojiText}</span>
                    </div>
                    <div className="emoji-container">
                      <button id="heart" message_id={message.id} data-emoji="heart" onClick={handleClickEmoji} onMouseOver={handleHoverEmoji}>❤️</button>
                      <span class="tooltip">Clicked: {emojiText}</span>
                    </div>
                  
                </div>
                {message.urls && message.urls.map((url, index2) => (
                  <div className='image-container'>
                    <img src={url}></img>
                  </div>
                  
                ))}
              </div>
            </div>
            )
          )}

        </div>

        <div className='sending-area'>
          <textarea className='sending-area-text' placeholder={'Message #'+channel_name} value={inputMessage}
      onChange={handleInputChange}></textarea>
          <button className='sending-area-button' onClick={sendMessage}>Send</button>
        </div>
        
      </div>
      )}
        

      {columnStyle === 'splash-three' && (
      <div className='right'>
        <div className='thread'>
          <div className='thread-text'>Thread</div>
          <button className='close' onClick={close}>X</button>
        </div>
        <div className='replies'>
          <div className='reply-message'>
            <div className='reply-user'>{oneMessage.name}</div>
            <div className='reply-text'>{oneMessage.body}</div>
          </div>
          {replies && replies.map((reply, index) => (
            <div className='reply'>
              <div className='reply-user'>{reply.name}</div>
              <div className='reply-text'>{reply.body}</div>
              <div>
                <div className="emoji-container">
                  <button id="smile" reply_id={reply.id} data-emoji="smile" onClick={handleClickReplyEmoji} onMouseOver={handleHoverReplyEmoji}>😊</button>
                  <span class="tooltip">Clicked: {replyEmojiText}</span>
                </div>
                
                <div className="emoji-container">
                  <button id="sad" reply_id={reply.id} data-emoji="sad" onClick={handleClickReplyEmoji} onMouseOver={handleHoverReplyEmoji}>😢</button>
                  <span class="tooltip">Clicked: {replyEmojiText}</span>
                </div>
                <div className="emoji-container">
                  <button id="heart" reply_id={reply.id} data-emoji="heart" onClick={handleClickReplyEmoji} onMouseOver={handleHoverReplyEmoji}>❤️</button>
                  <span class="tooltip">Clicked: {replyEmojiText}</span>
                </div>
              </div>
            </div>
          )
          )}
        </div>
        <div className='reply-sending-area'>

          <textarea className='reply-sending-area-text' placeholder={'Reply...'} value={inputReply}
      onChange={handleInputReplyChange}></textarea>
          <button className='reply-sending-area-button' onClick={sendReply}>Send</button>
        </div>
      </div>
      )}

      </div>
  )
}

function Login() {
  const history = useHistory();
  const location = useLocation();
  if (API_KEY) history.push("/");
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [signupUsername, setSignupUsername] = useState([]);
  const [signupPassword, setSignupPassword] = useState([]);

  const handleSignupUsernameChange = (event) => {
    setSignupUsername(event.target.value);
  };

  const handleSignupPasswordChange = (event) => {
    setSignupPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const signup = () => {
    const params = new URLSearchParams();
    params.append('name', signupUsername);
    params.append('password', signupPassword);
    fetch(API_ADDRESS + '/signup', {
    method: 'POST',
    headers: {
      'Authorization': API_ADDRESS,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        API_KEY = data.api_key;
        Cookies.set('dingwei_api_key', API_KEY, { expires: 7 });
        
        const { from } = location.state || { from: { pathname: "/" } };
        history.push(from);
      } else {
        alert(data.msg);
      }
    })
  }

  const login = () => {
    const params = new URLSearchParams();
    params.append('name', username);
    params.append('password', password);
    fetch(API_ADDRESS + '/login', {
    method: 'POST',
    headers: {
      'Authorization': API_ADDRESS,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        API_KEY = data.api_key;
        Cookies.set('dingwei_api_key', API_KEY, { expires: 7 });
        
        const { from } = location.state || { from: { pathname: "/" } };
        history.push(from);
      } else {
        alert(data.msg);
      }
    })
  }

  return(
    <div>
      <h3>Enter your username and password to log in:</h3>
      <div className="login-username-password">
        <div>
          Username
          <input id="login_username" onChange={handleUsernameChange}></input>
          <button onClick={login}>Login</button>
        </div>
        <div>
          Password
          <input id="login_password" onChange={handlePasswordChange}></input>
        </div>
      </div>
      <h3>Or ... Signup!</h3>
      <div>
        Username
        <input onChange={handleSignupUsernameChange}></input>
        <button onClick={signup}>Signup</button>
      </div>
      <div>
        Password
        <input onChange={handleSignupPasswordChange}></input>
      </div>
    </div>
  )
}

function Profile() {
  const [username, setUsername] = useState([]);
  const [changeUsername, setChangeUsername] = useState([]);
  const [changePassword, setChangePassword] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch(API_ADDRESS + '/users/username/get', {
      headers: {
        'Authorization': API_KEY,
      }
    })
    .then(response => response.json())
    .then(data => {
      setUsername(data.name)
    })
  }, [username])

  const handleChangeUsername = (event) => {
    setChangeUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setChangePassword(event.target.value)
  }

  const submitUsername = () => {
    if (!changeUsername) return;
    const params = new URLSearchParams();
    params.append('name', changeUsername);
    fetch(API_ADDRESS + '/users/username/change', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
    .then(response => response.json())
    .then(data => {
      if(data.status === "success"){
        alert("success");
        history.push("/");
      } else {
        alert(data.msg);
      }
    })
  }

  const submitPassword = () => {
    if (!changePassword) return;
    const params = new URLSearchParams();
    params.append('password', changePassword);
    fetch(API_ADDRESS + '/users/password/change', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params})
    .then(response => response.json())
    .then(data => {
      if(data.status === "success"){
        alert("success");
        history.push("/");
      } else {
        alert(data.msg);
      }
    })
  }

  const logout = () => {
    API_KEY = null;
    Cookies.remove('dingwei_api_key');
    history.push("/");
  }

  return (
    <>
      <div>Current User: {username}
      <button onClick={logout}>Logout</button>
      </div>
      Change Username:
      <input onChange={handleChangeUsername}></input>
      <button onClick={submitUsername}>Submit</button>
      Change Password:
      <input onChange={handleChangePassword}></input>
      <button onClick={submitPassword}>Submit</button>
      
    </>
  )
}

function SplashWithKey() {
  const { channel_id } = useParams();

  const key = `${channel_id}`;

  return <Splash key={key} />;
}

function App() {
  return (
    <BrowserRouter>
      <Route exact path={["/channel/:channel_id", "/channel/:channel_id/replies/:message_id"]}>
        <SplashWithKey />
      </Route>

      <Route exact path="/">
        <Splash />
      </Route>
      
      <Route path="/login">
        <Login />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>
    </BrowserRouter>
  );
}

export default App;
