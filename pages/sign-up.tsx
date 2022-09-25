import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaEnvelope, FaRegEnvelope } from 'react-icons/fa';
import { MdLock, MdLockOutline } from 'react-icons/md';
import { AiFillContacts, AiFillContainer, AiFillLayout } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { makeGraphqlQuery, makeGraphqlMutation } from 'apollo-client';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const SignUpForm = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: ""
  });

  const [errorState, setErrorState] = useState({
    username: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: ""
  });

  const validateSignUpData = () => {
    const newErrorState: any = {
      username: "",
      password: "",
      first_name: "",
      middle_name: "",
      last_name: ""
    }

    // validate first_name
    newErrorState.first_name = ((first_name): string => {
      if (!first_name) return "* First name is required!"
      if (first_name.length < 1) return "* First name must not be empty!";
      if (first_name.length > 100) return "* First name must not be longer than 100 characters!";
      return "";
    })(userInfo.first_name);

    newErrorState.middle_name = ((middle_name): string => {
      if (middle_name.length > 100) return "* Middle name must not be longer than 100 characters!";
      return "";
    })(userInfo.middle_name);

    newErrorState.last_name = ((last_name): string => {
      if (!last_name) return "* Last name is required!"
      if (last_name.length < 1) return "* Last name must not be empty!";
      if (last_name.length > 100) return "* Last name must not be longer than 100 characters!";
      return "";
    })(userInfo.last_name);

    newErrorState.username = ((username): string => {
      if (!username) return "* Username is required!"
      if (!/^([A-Za-z0-9]+)$/.test(username)) return "* Username must only contains alphabet and digit characters!";
      if (username.length < 3) return "* Username must not be shorter than 3 characters!";
      if (username.length > 30) return "* Username must not be longer than 30 characters!";
      return "";
    })(userInfo.username);

    newErrorState.password = ((password): string => {
      if (!password) return "* Password is required!"
      if (password.length < 6) return "* Password must not be shorter than 6 characters!";
      if (password.length > 200) return "* Password must not be longer than 200 characters!";
      return "";
    })(userInfo.password);
    setErrorState(newErrorState);

    let validationSucceeded: boolean = true;
    Object.keys(newErrorState).forEach(field => {
      if (newErrorState[field]) validationSucceeded = false;
    });


    return validationSucceeded;
  }

  const handleSubmitSignUpForm = async (e: any) => {
    e.preventDefault();

    // invalid sign up data
    if (!validateSignUpData()) {
      return;
    }

    try {
      const { data: { register: { user, access_token } } } = await makeGraphqlMutation(gql`
      mutation register($input: RegisterUserInput!){
        register(registerUserInput: $input){
          user{
            id
            username
            first_name
            middle_name
            last_name
            balance
          }
          access_token
        }
      }
  `, {
        "input": {
          "username": userInfo.username,
          "password": userInfo.password,
          "first_name": userInfo.first_name,
          "middle_name": userInfo.middle_name,
          "last_name": userInfo.last_name
        }
      });

      console.log(user);
      console.log(access_token);

      setErrorState({
        username: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: ""
      });
      alert('Register new user succesfully...');
      localStorage.setItem('jwtToken', access_token);
      window.location.href = '/stock/BTC';

    } catch (err: any) {
      setErrorState({
        username: err.message.toLowerCase().includes("username") ? "* " + err.message : "",
        password: err.message.toLowerCase().includes("password") ? "* " + err.message : "",
        first_name: err.message.toLowerCase().includes("first_name") ? "* " + err.message : "",
        middle_name: err.message.toLowerCase().includes("middle_name") ? "* " + err.message : "",
        last_name: err.message.toLowerCase().includes("last_name") ? "* " + err.message : ""
      });
      console.log(err);
    }
  }

  return (<form className='py-12'>
    <h2 className='text-3xl font-bold text-infinaPrimary mb-5'>Sign up</h2>
    <h4 className='text-gray-500 my-3'>Use your social network account</h4>
    <div className='flex justify-center'>
      <Link href='#'>
        <a className='border-2 border-gray-200 rounded-full p-3 mx-1'><FaFacebookF className='text-sm' /></a>
      </Link>
      <Link href='#'>
        <a className='border-2 border-gray-200 rounded-full p-3 mx-1'>
          <FaLinkedinIn className='text-sm' />
        </a>
      </Link>
      <Link href='#'>
        <a className='border-2 border-gray-200 rounded-full p-3 mx-1'>
          <FaGoogle className='text-sm' />
        </a>
      </Link>
    </div>
    <div className='border-2 w-36 border-infinaPrimary inline-block my-5'></div>
    <p className='text-gray-500 mb-3'>or create a new Infina account</p>
    <div className='flex flex-col items-center'>
      <div className='first_name_input_box mb-3 w-72'>
        <div className={`bg-gray-100 rounded-lg w-72 py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.first_name ? "border-red-200 focus-within:border-red-600" : "")}>
          <AiFillContacts className='text-gray-400 mr-2' />
          <input type="text" name="first_name" value={userInfo.first_name} onChange={e => { setUserInfo({ ...userInfo, first_name: e.target.value }) }} placeholder='First name' className='bg-gray-100 outline-none text-base flex-1 invalid:border-red-500' />
        </div>
        <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.first_name}</div>
      </div>

      <div className='middle_name_input_box mb-3 w-72'>
        <div className={`bg-gray-100 rounded-lg w-72 py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.middle_name ? "border-red-200 focus-within:border-red-600" : "")}>
          <AiFillContainer className='text-gray-400 mr-2' />
          <input type="text" name="middle_name" value={userInfo.middle_name} onChange={e => { setUserInfo({ ...userInfo, middle_name: e.target.value }) }} placeholder='Middle name' className='bg-gray-100 outline-none text-base flex-1' />
        </div>
        <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.middle_name}</div>
      </div>
      <div className='last_name_input_box mb-3 w-72'>
        <div className={`bg-gray-100 rounded-lg w-72 py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.last_name ? "border-red-200 focus-within:border-red-600" : "")}>
          <AiFillLayout className='text-gray-400 mr-2' />
          <input type="text" name="last_name" value={userInfo.last_name} onChange={e => { setUserInfo({ ...userInfo, last_name: e.target.value }) }} placeholder='Last name' className='bg-gray-100 outline-none text-base flex-1' />
        </div>
        <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.last_name}</div>
      </div>
      <div className='username_input_box mb-3 w-72'>
        <div className={`bg-gray-100 rounded-lg w-72 py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.username ? "border-red-200 focus-within:border-red-600" : "")}>
          <FaRegEnvelope className='text-gray-400 mr-2' />
          <input type="text" name="username" value={userInfo.username} onChange={e => { setUserInfo({ ...userInfo, username: e.target.value }) }} placeholder='Username' className='bg-gray-100 outline-none text-base flex-1' />
        </div>
        <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.username}</div>
      </div>
      <div className='password_input_box mb-3 w-72'>
        <div className={`bg-gray-100 rounded-lg w-72 py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.password ? "border-red-200 focus-within:border-red-600" : "")}>
          <MdLockOutline className='text-gray-400 mr-2' />
          <input type="password" name="password" value={userInfo.password} onChange={e => { setUserInfo({ ...userInfo, password: e.target.value }) }} placeholder='Password' className='bg-gray-100 outline-none text-base flex-1' />
        </div>
        <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.password}</div>
      </div>
      <div className='flex justify-between w-64 mb-5 mt-3 text-gray-500'>
        <label className='flex items-center text-sm'>
          <input type="checkbox" name="remember" className='mr-2 w-5 h-5' />Remember me
        </label>
        <Link href="#" className='text-sm hover:underline'><a>Forgot password?</a></Link>
      </div>
      <button className='border-2 border-infinaPrimary rounded-full px-12 py-2 inline-block font-semibold hover:bg-infinaPrimary hover:text-white' onClick={handleSubmitSignUpForm}>Next</button>
    </div>
  </form>);
}
const SignUp: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-100 ">
      <Head>
        <title>Sign up - Infina</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="bg-white rounded-2xl bg-red shadow-2xl flex w-3/4 max-w-4xl">
          <div className='w-3/5 p-5 flex flex-col justify-center'>
            <SignUpForm />
          </div>{/* Sign in section */}
          <div className='w-2/5 bg-infinaPrimary flex flex-col justify-center text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
            <div className='mb-5'>
              <a className="flex items-center py-4 px-2 justify-center">
                <span className='text-white text-3xl'>@Efiquant</span>
              </a>
            </div>
            <h2 className='mb-5 text-xl'>
              Simple and easy investing experience
            </h2>
            {/* <h2 className='text-2xl font-bold mb-2'>
              Hello, friend.
            </h2> */}
            <div className='border-2 w-full border-white inline-block mb-2'></div>
            <p className='mt-2'>
              <Link href='/sign-in'>
                <a className='text-white hover:underline'>
                  I had an account.<br />Sign in instead.
                </a>
              </Link>
            </p>
            {/* <p className='mb-2'>Fill up personal information and start journey with us.</p> */}
            {/* <Link href='#' className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-infinaPrimary'>Sign up</Link> */}
          </div>
          {/* Sign up section */}
        </div>
      </main>
    </div>
  )
}

export default SignUp
