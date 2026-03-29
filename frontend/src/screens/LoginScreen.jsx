import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import ImageRegister from '../Images/backgroundRegisterLogin.svg'
import BgVideo from '../Videos/Video1.mp4'
import { useRef } from 'react';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const videoRef = useRef(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.9;
  }
}, []);

  useEffect(() => {
    if (userInfo) {
      navigate('/code', { replace: true });
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate('/code', { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Login failed');
    }
  };

  return (
    <div className="maindiv">

    <div className="ImageContainer">
      <img class="ImgClass" src={ImageRegister} alt="register" />
    </div>

     <video ref={videoRef} className="bg-video" autoPlay muted loop playsInline>
      <source src={BgVideo} type="video/mp4" />
    </video>
      <div className="video-overlay"></div>

    <div className="RegisterLoginContainer">
    <FormContainer>
      
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>


        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="mt-3">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New user? <Link to="/register">Register a new account</Link>
        </Col>
      </Row>
    </FormContainer>
     </div>
    </div>
  );
};

export default LoginScreen;