import React, { useEffect, useState } from 'react'
import './Home.css'
// import NavbarSm from '../components/NavbarSm'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComments, faUser, faUserCircle, faRightFromBracket, faImage } from '@fortawesome/free-solid-svg-icons'
import Tweet from '../components/Tweet'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('')
    const [image, setImage] = useState({ preview: '', data: '' })
    const [loading, setLoading] = useState(false)
    const [allTweets, setAllTweets] = useState([])
    const [myDetail, setMyDetail] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const myProfile = (id) => {
        // console.log(id)
        navigate(`/profile/${id}`)
    }

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

    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img)
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response
    }

    const addTweet = async () => {
        try {
            if (content === '') {
                toast.error("Write some content first")
                return
            }

            setLoading(true)
            let imageAPI = '';
            if (image && image.data) {
                const imgRes = await handleImgUpload();
                imageAPI = `${API_BASE_URL}/files/${imgRes.data.fileName}`
            }
            const request = { content, image: imageAPI }
            const response = await axios.post(`${API_BASE_URL}/tweet`, request, CONFIG_OBJ)
            setLoading(false)
            if (response.status === 200) {
                toast.success("Tweet added successfully")
                getalltweets()
                navigate("/")

            } else {
                toast.error("Some error try again")
            }
        } catch (error) {
            console.log(error)
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

    const getalltweets = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getalltweets`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                debugger
                setAllTweets(response.data.tweets)
            }
        } catch (error) {
            toast.error("Some error")
            console.log(error)
        }
    }

    useEffect(() => {
        getalltweets()
        myDetails()
    }, [])

    return (
        <div className='container'>
            {/* <NavbarSm></NavbarSm> */}
            <div className='row'>
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
                        <button className='link-left btn-link' onClick={() => logout()} ><FontAwesomeIcon className='home-fontIcon stick-left' icon={faRightFromBracket}></FontAwesomeIcon><span className='sidebar-names'> Logout</span> </button>
                    </div>
                    <div className='row ' onClick={() => myProfile(myDetail._id)} id='profileFull'>
                        <Link className='link-left' to={`/profile/${myDetail._id}`}><FontAwesomeIcon id='profile' className='home-fontIcon stick-left ms-0' icon={faUserCircle}></FontAwesomeIcon><span className='sidebar-names'>{myDetail.Name}</span> </Link>
                        <p className='profileUsername sidebar-names '>{myDetail.Username}</p>
                    </div>

                    {/* <div onClick={() => userProfile(props.tweet.tweetedBy._id)}>
                                <img src={props.tweet && props.tweet.tweetedBy ? props.tweet.tweetedBy.profilePicture : null} className='profile-pic' alt='profile-pic'></img>
                                <NavLink to={`/profile/${props.tweet.tweetedBy._id}`}><p className='card-username'>{props.tweet && props.tweet.tweetedBy ? props.tweet.tweetedBy.Username : null} .<span className='tweet-date'>{date}</span></p></NavLink>
                            </div> */}
                </div >
                <div className='col-lg-6 col-md-8 col-sm-10 shadow-sm right-col'>
                    <div className='row'>
                        <div className='col-4 header-home'>
                            <h5 className='header-home'>Home</h5>
                        </div>
                        <div className='col-8 header-home'>
                            <button onClick={handleShow} className='btn btn-primary btn-tweet'>Tweet</button>
                        </div>

                    </div>
                    {allTweets.map((tweet) => {
                        return (
                            <div className='row' key={tweet._id}>
                                <Tweet tweet={tweet} getalltweets={getalltweets}></Tweet>
                            </div>
                        )
                    })}
                </div>
            </div >
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                    <Modal.Title>New Tweet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? <div className='col-md-12 text-center'>
                        <div className="spinner-border " role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> : ''}
                    <textarea className='modal-textarea' value={content} onChange={(e) => setContent(e.target.value)} rows='4' cols='60' placeholder='Write your tweet'></textarea>
                    <div>
                        <input name="file" type="file" id="drop_zone" onChange={handleFileSelect} className="FileUpload" accept=".jpg,.png,.gif" />
                        {image.preview && <img src={image.preview} width='450' height='350' alt='tweet' />}
                        <FontAwesomeIcon className='upload-icon' icon={faImage}></FontAwesomeIcon>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => addTweet()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer></ToastContainer>
        </div >
    )
}

export default Home