import React, { useState } from 'react'
// import photo from '../images/photo.JPG'
import './Tweet.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faComment, faRetweet, faTrash, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { toast } from 'react-toastify'
// import TweetDetail from '../pages/TweetDetail'

const Tweet = (props) => {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('')

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dateObj = props.tweet && props.tweet.updatedAt ? new Date(props.tweet.updatedAt) : null;
    const date = dateObj ? dateObj.toISOString().split('T')[0] : '';


    ///authenticate if user is 

    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    const userId = user ? user._id : null;

    const CONFIG_OBJ = {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }
    const navigate = useNavigate()
    const userProfile = (id) => {
        // console.log(id)
        navigate(`/profile/${id}`)
    }

    const oneTweet = (id) => {
        navigate(`tweet/${id}`)
    }

    const retweet = async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tweet/${id}/retweet`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success("Retweeted successfully")
                props.getalltweets()
            } else {
                toast.error("Some error while retweet")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTweet = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deletetweet/${id}`, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('Tweet deleted Successfully')
                props.getalltweets()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const likeTweet = async (id) => {
        // console.log(id)
        try {
            const response = await axios.put(`${API_BASE_URL}/tweet/${id}/like`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('Liked tweet')
                props.getalltweets()

            } else {
                toast.error('some error')
            }
        } catch (error) {
            console.log(error)
        }
    }



    const disLikeTweet = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tweet/${id}/dislike`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('Disliked tweet')
                props.getalltweets()
            }
        } catch (error) {
            console.log(error)
        }
    }
    // const isliked = () => {
    //     return props.tweet && props.tweet.likes ? props.tweet.likes.includes(userId) : null;
    // }

    const reply = async (id) => {
        try {
            const request = { content }
            const response = await axios.post(`${API_BASE_URL}/tweet/${id}/reply`, request, CONFIG_OBJ)
            if (response.status === 200) {
                props.getalltweets()
                toast.success('Replied successfully')
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (!props.tweet) {
        return null;
    }

    return (
        <div>
            <div className="card card-tweet card-click" >
                <div className="card-body card-click">
                    <p className="retweeted-by">Retweeted By <b>{props.tweet && props.tweet.retweetBy[0] ? props.tweet.retweetBy[props.tweet.retweetBy.length - 1].Username : null}</b></p>
                    <div className='row'>
                        <div className='col'>
                            <div onClick={() => userProfile(props.tweet.tweetedBy._id)}>
                                <img src={props.tweet && props.tweet.tweetedBy ? props.tweet.tweetedBy.profilePicture : null} className='profile-pic' alt='profile-pic'></img>
                                <NavLink to={`/profile/${props.tweet.tweetedBy._id}`}><p className='card-username'>{props.tweet && props.tweet.tweetedBy ? props.tweet.tweetedBy.Username : null} .<span className='tweet-date'>{date}</span></p></NavLink>
                            </div>
                            {props.tweet && props.tweet.tweetedBy ? props.tweet.tweetedBy._id === userId ? <button className='delete-btn' onClick={() => deleteTweet(props.tweet._id)}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button> : '' : null}
                            {/* {console.log(userId, retweete)} */}
                        </div>
                        <p className="card-text" onClick={() => oneTweet(props.tweet._id)}>{props.tweet && props.tweet ? props.tweet.content : null}</p>
                    </div>
                </div>
                {props.tweet ? props.tweet.image !== '' && (
                    <img src={props.tweet.image} onClick={() => oneTweet(props.tweet._id)} className="card-img-bottom  card-click" alt="..." />

                ) : null}
                <div className='row icons-bottom'>
                    <div className='col  like-dislike'>
                        {/* liked */}

                        <Link><FontAwesomeIcon className='card-fontIcon1 card-fontIcon' onClick={() => disLikeTweet(props.tweet._id)} id='liked' icon={faThumbsDown}></FontAwesomeIcon></Link>
                        <Link onClick={() => likeTweet(props.tweet._id)}><FontAwesomeIcon className='card-fontIcon1 card-fontIcon' icon={faHeart}></FontAwesomeIcon></Link>
                        <span className='like-count'>{props.tweet && props.tweet.likes ? props.tweet.likes.length : null}</span>
                        <Link><FontAwesomeIcon className='card-fontIcon ms-2 me-2' onClick={handleShow} icon={faComment}></FontAwesomeIcon></Link>
                        <span className='like-count'>{props.tweet && props.tweet.replies ? props.tweet.replies.length : null}</span>
                        <Link onClick={() => retweet(props.tweet._id)}><FontAwesomeIcon className='card-fontIcon' icon={faRetweet} ></FontAwesomeIcon></Link>
                        <span className='like-count'>{props.tweet && props.tweet.retweetBy ? props.tweet.retweetBy.length : null}</span >
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tweet your reply</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea className='modal-textarea' value={content} onChange={(e) => setContent(e.target.value)} rows='4' cols='60' placeholder='Write your tweet'></textarea>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className='btn btn-primary' onClick={() => reply(props.tweet._id)}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default Tweet