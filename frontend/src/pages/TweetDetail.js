// import React from 'react'
import React, { useEffect, useState } from 'react'
import './Profile.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComments, faUser, faUserCircle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
// import photo from '../images/photo.JPG'
import Tweet from '../components/Tweet'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { toast } from 'react-toastify'

const TweetDetail = () => {

    const [myDetail, setMyDetail] = useState('')
    const [tweetDetails, setTweetDetails] = useState('')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const myProfile = (id) => {
        // console.log(id)
        navigate(`/profile/${id}`)
    }

    const { id } = useParams();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: 'LOGIN_ERROR' })
        navigate('/login')
    }
    const CONFIG_OBJ = {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }

    const myDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/myDetails`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setMyDetail(response.data.result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getTweet = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/gettweet/${id}`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setTweetDetails(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myDetails()
        getTweet()
    }, [])
    return (
        <div>
            <div className='col-3  left-colHome'>
                <div className='row'>
                    <FontAwesomeIcon className='home-fontIcon stick-left' id='topIcon-home' icon={faComments}></FontAwesomeIcon>
                </div>
                <div className='row'>
                    <Link className='link-left mt-4' to='/'><FontAwesomeIcon className='home-fontIcon stick-left' icon={faHouse}></FontAwesomeIcon> <span className='sidebar-names'>Home</span></Link>
                </div>
                <div className='row'>
                    <button className='link-left btn-link' onClick={() => myProfile(myDetail._id)}><FontAwesomeIcon className='home-fontIcon stick-left' icon={faUser}></FontAwesomeIcon><span className='sidebar-names'>Profile</span> </button>

                </div>
                <div className='row'>
                    <button className='link-left btn-link' onClick={() => logout()}><FontAwesomeIcon className='home-fontIcon stick-left' icon={faRightFromBracket}></FontAwesomeIcon><span className='sidebar-names'> Logout</span> </button>
                </div>
                <div className='row ' onClick={() => myProfile(myDetail._id)} id='profileFull'>
                    <Link className='link-left' to={`/profile/${myDetail._id}`}><FontAwesomeIcon id='profile' className='home-fontIcon stick-left ' icon={faUserCircle}></FontAwesomeIcon><span className='sidebar-names'>{myDetail.Name}</span> </Link>
                    <p className='profileUsername sidebar-names'>{myDetail.Username}</p>

                </div>
            </div >
            <div className='col-lg-6 col-md-8 col-sm-10 shadow-sm right-col'>
                <div className='row'>
                    <div className='col-4 header-home'>
                        <h5 className='header-home'>Tweet</h5>
                    </div>
                    <Tweet tweet={tweetDetails.tweetDetails}></Tweet>
                    <p>Replies</p>
                    {/* <Tweet tweet={getTweet} getTweet={getTweet}></Tweet> */}

                    {tweetDetails.replyDetails && tweetDetails.replyDetails.map((reply) => {
                        return (
                            <Tweet tweet={reply}></Tweet>
                        )

                    })}


                </div>

            </div>
        </div>
    )
}

export default TweetDetail