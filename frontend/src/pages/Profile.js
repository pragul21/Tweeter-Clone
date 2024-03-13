import React, { useEffect, useState } from 'react'
import './Profile.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faComments, faUser, faUserCircle, faRightFromBracket, faCalendar, faLocationArrow } from '@fortawesome/free-solid-svg-icons'
// import photo from '../images/photo.JPG'
import Tweet from '../components/Tweet'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { toast } from 'react-toastify'

const Profile = () => {
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [mytweet, setMytweet] = useState([])
    const [userDetail, setUserDetail] = useState()
    const [profilePicture, setProfilePicture] = useState({ preview: '', data: '' })
    const [Name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [DOB, setDOB] = useState('')
    const [myDetail, setMyDetail] = useState('')


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClose = () => setShowEdit(false)
    const handleEditShow = () => setShowEdit(true)

    const { id } = useParams();


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const myProfile = (id) => {
        // console.log(id)
        navigate(`/profile/${id}`)
    }
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    const userId = user ? user._id : null;

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
    const dateObj = userDetail && userDetail.DOB ? new Date(userDetail.DOB) : null;
    const date = dateObj ? dateObj.toISOString().split('T')[0] : '';
    const myTweets = async () => {

        try {
            const response = await axios.get(`${API_BASE_URL}/profile/${id}`, CONFIG_OBJ)
            if (response.status === 200) {
                // debugger
                setMytweet(response.data.tweets)


            }
        } catch (error) {
            console.log(error)
            toast.error('Unablle to get your posts')
        }
    }
    //user details
    const userDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${id}`, CONFIG_OBJ)
            // debugger
            if (response.status === 200) {
                setUserDetail(response.data.result)
            }
        } catch (error) {
            console.log(error)
            toast.error('Could not get user details')
        }
    }

    //myprofile 
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

    //profilepicture
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setProfilePicture(img)
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', profilePicture.data)

        const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }

    const userProfilePicture = async () => {
        try {
            const imgRes = await handleImgUpload();
            const request = { profilePicture: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            const response = await axios.post(`${API_BASE_URL}/user/${id}/uploadProfilePic`, request, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('Profile picture updated successfully')
                userDetails()
                navigate(`/profile/${id}`)
            } else {
                toast.error('Could not upload profile picture')
            }
        } catch (error) {
            console.log(error)

            toast.error('You are not authoried to update profile pic')
        }
    }
    //edit user details
    const editDetails = async () => {
        const request = { Name, DOB, location }
        try {

            const response = await axios.put(`${API_BASE_URL}/user/${id}/edit`, request, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('User details updated')
                userDetails()
                navigate(`/profile/${id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const follow = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/${id}/follow`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('Followed succesfully')
                userDetails();

            } else {
                toast.error('some error while following')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const isFollowed = () => {
        return userDetail && userDetail.followers ? userDetail.followers.includes(userId) : null;
    }

    const Unfollow = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/${id}/unfollow`, {}, CONFIG_OBJ)
            if (response.status === 200) {
                toast.success('unfollowed successfully')
                userDetails()
            }
        } catch (error) {
            console.log(error)
        }
    }
    // const isUnfollowed = () => {
    //     return userDetail && userDetail.followers ? !userDetail.followers.includes(userId) : null;
    // }
    useEffect(() => {
        myTweets()
        userDetails()
        myDetails()
    }, [])
    return (
        <div className='container'>
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
                        <button className='link-left btn-link' onClick={() => logout()}><FontAwesomeIcon className='home-fontIcon stick-left' icon={faRightFromBracket}></FontAwesomeIcon><span className='sidebar-names'> Logout</span> </button>

                    </div>
                    <div className='row ' onClick={() => myProfile(myDetail._id)} id='profileFull'>
                        <Link className='link-left' to={`/profile/${myDetail._id}`}><FontAwesomeIcon id='profile' className='home-fontIcon stick-left ' icon={faUserCircle}></FontAwesomeIcon><span className='sidebar-names'>{myDetail.Name}</span> </Link>
                        <p className='profileUsername sidebar-names'>{myDetail.Username}</p>

                    </div>
                </div >
                <div className='col-6 right-col'>
                    <div className='row blue-cover'> </div>
                    <div className='row'>
                        <img src={userDetail ? userDetail.profilePicture : null} className='profile-image' alt='photu'></img>
                    </div>

                    <div className='buttons-user'>
                        {userId.toString() === id.toString() ? <button id='updateProfile-btn' onClick={handleShow}>Update Photo</button> : ''}
                        {userId.toString() === id.toString() ? <button id='edit-btn' onClick={handleEditShow}>Edit</button> : ''}
                    </div>

                    <div className='row'>
                        <div className='col-10 below-profile'>
                            <p className='name-profile'>{userDetail ? userDetail.Name : null}</p>
                            <p style={{ fontSize: '75%', fontWeight: '300', marginTop: '-20px' }}>{userDetail ? userDetail.Username : null}</p>
                            <div className='fontIcon-profile'> <FontAwesomeIcon icon={faCalendar} ></FontAwesomeIcon>{userDetail && userDetail.DOB ? date : 'Not Updated'}</div>
                            <div className='fontIcon-profile'> <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>{userDetail && userDetail.location ? userDetail.location : 'Not Updated'}</div>
                            <p className='following'>{userDetail ? userDetail.following.length : 0}Following <span> {userDetail ? userDetail.followers.length : 0}Followers</span></p>
                        </div>
                        {userId.toString() !== id ? <div className='col-2'>

                            {!isFollowed() && (
                                <button className='btn btn-dark follow-btn' onClick={follow}>Follow</button>
                            )}
                            {isFollowed() && (
                                <button className='btn btn-dark follow-btn' onClick={Unfollow} >Unfollow</button>
                            )}
                        </div> : ''}
                        <hr></hr>
                    </div>

                    <div className='row'>
                        <h6>Tweets and Replies</h6>
                    </div>
                    {mytweet?.map((tweet) => {
                        return (
                            <Tweet tweet={tweet} myTweets={myTweets}></Tweet>
                        )
                    })}


                </div>
            </div >
            {/* model for updating photo */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='row' id='image-input'>
                        <input name="file" type="file" id="drop_zone" className="FileUpload-profile ms-2" accept=".jpg,.png,.gif" onChange={handleFileSelect} />
                        {profilePicture.preview && <img src={profilePicture.preview} className='profile-uploadImg' alt='photu'></img>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className='btn btn-primary' onClick={userProfilePicture}>
                        Upload Pic
                    </button>
                </Modal.Footer>
            </Modal>
            {/*  */}
            {/*  */}
            {/* model for editing details */}
            <Modal show={showEdit} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className='row'>
                            <lable>Name</lable>
                            <input type='text' value={Name} onChange={(ev) => setName(ev.target.value)} className='edit-details' placeholder='enter your name'></input>
                        </div>
                        <div className='row'>
                            <lable>Location</lable>
                            <input type='text' value={location} onChange={(ev) => setLocation(ev.target.value)} className='edit-details' placeholder='location format (india,delhi)'></input>
                        </div>
                        <div className='row'>
                            <lable>D.O.B</lable>
                            <input type='date' value={DOB} onChange={(ev) => setDOB(ev.target.value)} className='edit-details' placeholder='enter your name'></input>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                    <button className='btn btn-primary' onClick={editDetails}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default Profile