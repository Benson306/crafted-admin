import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Label, Input, Button } from '@windmill/react-ui'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext'

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const history = useHistory();

  const handleSubmit = () =>{
    
    if(email.length == 0 || password.length == 0){
        toast('Credentials cannot be Empty',{
          type:'error'
        })
      return;
    }
    setLoading(true)
    
    fetch(`${process.env.REACT_APP_API_URL}/admin_login`,{
      
      method:'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ email, password})
    })
    .then(res => {
      if(res.ok){
        res.json().then(response =>{
          toast('Success',{
              type:'success'
            })
            login(response);
            history.push('/app')
          });
          setLoading(false);
      }else{
        toast('Wrong Credentials',{
          type:'error'
        });
        setLoading(false);
      }
    })
    .catch(err => {
      setLoading(false); 
      console.log(err)
    })

    //setLoading(false);
  }
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
            <ToastContainer />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <Label>
                <span>Email</span>
                <Input className="mt-1" type="email" placeholder="john@doe.com" onChange={e=> setEmail(e.target.value)} required />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" type="password" placeholder="***************" onChange={e => setPassword(e.target.value)} required />
              </Label>

              { loading ? <div className='mt-4 border text-black dark:text-purple-600 border-black dark:border-purple-600 p-2 text-center bg-transparent rounded'>Loading....</div> :<Button type="submit" className="mt-4" onClick={()=>{handleSubmit()}}>
                Log in
              </Button> }
{/* 
              <hr className="my-8" /> */}

              {/* <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button> */}

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
              {/* <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link>
              </p> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
