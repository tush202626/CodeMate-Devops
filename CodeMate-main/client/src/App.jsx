import Home from "./components/pages/Home";
import EditorPage from "./components/pages/EditorPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Toast from "./components/toast/Toast";
import { AppProvider } from "./context/AppContext";
import { SocketProvider } from "./context/SocketContext";
import { ViewProvider } from "./context/ViewContext";
import { ChatContextProvider } from "./context/ChatContext";
import { FileSystemProvider } from "./context/FileContext"; // Make sure this is imported
import { ExecuteCodeContextProvider } from "./context/ExecuteCodeContext";
import LandingPage from "./components/pages/LandingPage/page";
import Dashboard from "./components/pages/Dashboard";
import AuthRoute from "./routes/AuthRoute";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <AppProvider>
        <SocketProvider>
          <FileSystemProvider>
            <ViewProvider>
              <ExecuteCodeContextProvider>
                <ChatContextProvider>
                    <Routes>
                      <Route path='/' element= { <LandingPage/>} />
                      <Route path="/homepage" element={<Home />} />
                      <Route path="/editor/:roomId" element={<EditorPage />} />
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/login" element={<AuthRoute><Home /></AuthRoute>} />
                    </Routes>
                </ChatContextProvider>
              </ExecuteCodeContextProvider>
            </ViewProvider>
          </FileSystemProvider>
        </SocketProvider>
      </AppProvider>
      <Toast />
    </Router>
  );
}

export default App;
