import React, { useState } from 'react'
import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const Login = () => {
    const [Username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const login = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const data = { Username, password }
            const response = await axios.post(`${API_BASE_URL}/login`, data)

            if (response.status === 200) {
                debugger
                setLoading(false)
                localStorage.setItem("token", response.data.result.token)
                localStorage.setItem("user", JSON.stringify(response.data.result.user))
                dispatch({ type: "LOGIN_SUCCESS", payload: response.data.result.user })
                toast.success("Login Succesfull")
                navigate('/')
            }
            setLoading(false)
            // toast.error("Wrong credentials")
        } catch (error) {
            setLoading(false)
            toast.error("Wrong credentials")
            console.log(error)
        }
    }

    return (
        <div>
            <div className='small-screen'>
                <h5>Welcome Back</h5>
                <Link><FontAwesomeIcon className='icon-smScreen' icon={faComments}></FontAwesomeIcon></Link>
            </div>
            {loading ? <div className='col-md-12 loading-screen text-center'>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> : ''}
            <div className='container shadow login-container'>
                <div className='row '>
                    <div className='col-4 left-col'>
                        <div className='row left-textRow'>
                            <h6>Welcome Back</h6>
                        </div>
                        <div className='row left-iconRow'>
                            <Link><FontAwesomeIcon className='login-fontIcon' icon={faComments}></FontAwesomeIcon></Link>
                        </div>

                    </div>
                    <div className='col-8 '>
                        <form className='form-login' onSubmit={(e) => login(e)}>
                            <div className='row'>
                                <h5 className='label-login'>LOG IN</h5>
                            </div>
                            <div className='row'>
                                <input type='text' value={Username} onChange={(ev) => setUsername(ev.target.value)} className='login-input' placeholder='UserName'></input>
                            </div>
                            <div className='row'>
                                <input type='password' value={password} onChange={(ev) => setPassword(ev.target.value)} className='login-input' placeholder='Password'></input>
                            </div>
                            <div className='row'>
                                <button type='submit' className='btn btn-dark login-btn'>Login</button>
                            </div>
                            <div className='row'>
                                <p className='login-register'>Don't have an account? <Link to='/signup'>Register Here</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login