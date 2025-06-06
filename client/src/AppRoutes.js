import React, {useContext, useEffect} from 'react'
import axios, { useAxiosInterceptors } from './api/axios'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import AuthContext from './context/AuthProvider'

import Register from './elements/Auth/Register'
import Login from './elements/Auth/Login'
import Logout from './elements/Auth/Logout'

import Home from './elements/Home/Home'
import JudgeProfile from './elements/Judges/JudgeProfile'
// import Judges from './elements/Judges/Judges'
import Tournaments from './elements/Tournaments/Tournaments'

import TournPage from './elements/Tournaments/TournPage'
import CreateAccount from './elements/Auth/CreateAccounts'
import JudgeHistory from './elements/Judges/JudgeHistory'
import Public from './elements/Public/Public'

import CardBot from './elements/CardBot/CardBot'

import PublicTournaments from './elements/Public/PublicTournaments'
import PublicJudges from "./elements/Public/PublicJudges"
import PublicTournPage from './elements/Public/PublicTournPage'
import PublicJudgePage from './elements/Public/PublicJudgePage'
import Contributions from './elements/Public/Contributions'
import Topic from './elements/CardBot/Topic'

function AppRoutes() {
    useAxiosInterceptors();

    const {auth, setAuth} = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("lastVisitedPage", location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const lastVisitedPage = sessionStorage.getItem("lastVisitedPage");
    
        if (auth?.accessToken && lastVisitedPage) {
            navigate(lastVisitedPage, { replace: true });
        }

      }, [auth?.accessToken, navigate]);

    useEffect(() => {
        const refreshAccessToken = async () => {
            if (auth?.loggedOut || !auth?.accessToken) {
                return;
            }

            try {
                const response = await axios.post('/api/auth/refresh', {}, {
                    withCredentials: true, // Send cookies with the request
                });

                const newAccessToken = response.data.accessToken;

                if (newAccessToken !== auth.accessToken) {
                    setAuth((prev) => ({ ...prev, accessToken: newAccessToken, loggedOut: false, admin: response.data.admin }));
                    sessionStorage.setItem('accessToken', newAccessToken);
                }
            } catch (err) {
                console.error("Error refreshing access token:", err);
            }
        }

        if (auth?.accessToken) {
            refreshAccessToken();
        }

    }, [location.pathname]);

    const ProtectedRoute = ({children}) => {
        const location = useLocation();

        if (!auth?.accessToken) {
            return <Navigate to="/" replace />
        }
        return children;
    };


    /*
        Current routes:
            /login
            /register
            /logout

            /home/:userid

            /myprofile/:id
            /judgehistory/:id

            /judges/JudgeProfile/:id
            /tournaments
            /tournaments/:tournId
    */
    return (
        <Routes>
            <Route
            path="/home/:userID"
            element={
                <ProtectedRoute>
                <Home />
                </ProtectedRoute>
            } />

            <Route path="/public" element={<Public />} />
            <Route path="/public/tournaments" element={<PublicTournaments />} />
            <Route path="/public/tournaments/:id" element={<PublicTournPage />} />
            <Route path="/public/judges" element={<PublicJudges />} />
            <Route path="/public/judges/:id" element={<PublicJudgePage />} />
            <Route path="/contributions" element={<Contributions />} />

            <Route path="/login" element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Login />} />
            <Route path='/register' element={(auth.accessToken && auth.admin === 1) ? <ProtectedRoute> <CreateAccount /> </ProtectedRoute> : <Navigate to="/login" />}/>
            <Route path='logout' element={<Logout />} />

            <Route exact path='/' element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Navigate to="/public" />} />

            {/* <Route path="/judges" element={auth.accessToken ? <ProtectedRoute> <Judges />  </ProtectedRoute> : <Navigate to="/login" />}/> */}
            <Route path='/judges/JudgeProfile/:id' element={auth.accessToken ? <ProtectedRoute> <JudgeProfile /> </ProtectedRoute> : <Navigate to="/login" />} />

            <Route path="/tournaments" element={auth.accessToken ? <ProtectedRoute> <Tournaments />  </ProtectedRoute> : <Navigate to="/login" />}/>
            <Route path='/tournaments/:tournId' element={auth.accessToken ? <ProtectedRoute> <TournPage /> </ProtectedRoute> : <Navigate to="/login" />} />

            <Route path="/card-bot" element={auth.accessToken ? <ProtectedRoute> <CardBot />  </ProtectedRoute> : <Navigate to="/login" />}/>
            <Route path="/card-bot/:topicID" element={auth.accessToken ? <ProtectedRoute> <Topic />  </ProtectedRoute> : <Navigate to="/login" />}/>

            <Route path='/myprofile/:id' element={auth.accessToken ? <ProtectedRoute> <JudgeProfile /> </ProtectedRoute> : <Navigate to="/login" />} />
            <Route path='/judgehistory/:id' element={auth.accessToken ? <ProtectedRoute> <JudgeHistory j_id={auth.userId}/> </ProtectedRoute> : <Navigate to="/login" />} />

        </Routes>
    )
}

export default AppRoutes