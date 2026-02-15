import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./store/features/authSlice";
import { useEffect } from "react";
import api from "./api/axios";
import Register from "./pages/Register"
import Layout from "./Layout/Layout";
import Login from "./pages/Login";
import FriendsPage from "./pages/FriendsPage";
import UsersPage from "./pages/UsersPage";
import RequestsPage from "./pages/RequestsPage";
import ChatLayout from "./Layout/ChatLayout";
import ChatPage from "./pages/ChatPage";
import DefaultChatPage from "./pages/DefaultChatPage";
import io from "socket.io-client";


function App() {

  const user = useSelector((state) => state.auth.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  // socket connection with userId in query
  useEffect(() => {
    if (user?.id) {
      console.log("Connecting socket for user:", user.id);

      const socketConnection = io('http://localhost:3000', {
        query: {
          userId: user.id.toString()  //  Pass userId as string
        }
      });

      socketConnection.on('connect', () => {
        console.log('Socket connected:', socketConnection.id);
      });

      socketConnection.on('getOnlineUsers', (onlineUsers) => {
        console.log('Online users:', onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketConnection.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      dispatch(setSocket(socketConnection));

      return () => {
        console.log('Disconnecting socket');
        socketConnection.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user?.id, dispatch]);


  useEffect(() => {
    const rehydrateAuth = async () => {

      try {
        const res = await api.get("/auth/me");

        dispatch(
          loginSuccess({
            user: res.data?.data,
          })
        );
      } catch (err) {
        dispatch(logout());

      }
    };

    rehydrateAuth();
  }, [dispatch]);



  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={user ? <ChatLayout /> : <Navigate to="/register" replace />} />
          <Route path="chat" element={user ? <ChatLayout /> : <Navigate to="/login" replace />} >
            <Route index element={<DefaultChatPage />} />
            <Route path=":userId" element={<ChatPage />} />
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="friends" element={user ? <FriendsPage /> : <Navigate to="/login" replace />} />
          <Route path="users" element={user ? <UsersPage /> : <Navigate to="/login" replace />} />
          <Route path="requests" element={user ? <RequestsPage /> : <Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </>
  )
}
import { setOnlineUsers, setSocket } from "./store/features/socketSlice";

export default App
