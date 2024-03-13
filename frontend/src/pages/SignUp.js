import React, { useState } from 'react'
import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [Name, setName] = useState('')
    const [Username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signup = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const data = { Name, Username, email, password };
            const response = await axios.post(`${API_BASE_URL}/signup`, data);
            if (response.status === 200) {
                setLoading(false);
                toast.success("Signed up successfully!");
                navigate('/login');
            } else {
                toast.error("Some error try again !")

            }
        } catch (error) {
            console.log(error);
            toast.error("Some error try again !")
        }
    };
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
                        <form onSubmit={(e) => signup(e)}>

                            <div className='row'>
                                <h5 className='label-login mt-3'>Register</h5>
                            </div>
                            <div className='row'>
                                <input type='text' value={Name} onChange={(ev) => setName(ev.target.value)} className='login-input' placeholder='Full Name'></input>
                            </div>
                            <div className='row'>
                                <input type='email' value={email} onChange={(ev) => setEmail(ev.target.value)} className='login-input' placeholder='Email'></input>
                            </div>
                            <div className='row'>
                                <input type='text' value={Username} onChange={(ev) => setUsername(ev.target.value)} className='login-input' placeholder='UserName'></input>
                            </div>
                            <div className='row'>
                                <input type='password' value={password} onChange={(ev) => setPassword(ev.target.value)} className='login-input' placeholder='Password'></input>
                            </div>
                            <div className='row'>
                                <button className='btn btn-dark login-btn' type='submit'>Signup</button>
                            </div>
                            <div className='row'>
                                <p className='login-register'>Already have an account? <Link to='/login'>LOG IN</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default SignUp