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
              <svg className='inline-block' width="128" height="25" viewBox="0 0 128 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.8038 19.1656L34.9581 9.96971C34.9418 9.88891 34.9093 9.82426 34.893 9.74345L34.8605 9.64648C33.3157 4.99197 28.8926 1.63037 23.6889 1.63037C19.5911 1.63037 15.981 3.71521 13.8833 6.8667L15.5907 8.56366C15.9485 7.94952 16.3876 7.38387 16.8917 6.8667L17.2169 6.54347C17.3145 6.4465 17.412 6.3657 17.5096 6.26873C19.1683 4.83035 21.331 3.95763 23.7052 3.95763C28.9088 3.95763 33.1206 8.14346 33.1206 13.3151C33.1206 18.4868 28.9088 22.6727 23.7052 22.6727C20.2578 22.6727 17.2332 20.8303 15.607 18.0666L13.8996 19.7636C16.0135 22.9151 19.6073 24.9999 23.7052 24.9999H35.4622V19.1495H37.8038V19.1656Z" className="fill-white"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M28.6973 8.36976C25.9492 5.63846 21.5098 5.63846 18.7616 8.36976L15.3792 11.7314L11.9969 8.36976C9.24868 5.63846 4.80931 5.63846 2.06113 8.36976C-0.687045 11.1011 -0.687045 15.5132 2.06113 18.2444C4.80931 20.9757 9.24868 20.9757 11.9969 18.2444L15.3792 14.8829L18.7616 18.2444C21.5098 20.9757 25.9492 20.9757 28.6973 18.2444C31.4292 15.5293 31.4292 11.1011 28.6973 8.36976ZM10.4032 16.6768C8.53318 18.5354 5.50855 18.5354 3.65475 16.6768C1.80095 14.8182 1.78469 11.8122 3.65475 9.96975C5.52482 8.11118 8.54944 8.11118 10.4032 9.96975L13.7856 13.3313L10.4032 16.6768ZM20.3552 16.6768C22.209 18.5354 25.2337 18.5354 27.1037 16.6768C28.9575 14.8182 28.9575 11.8122 27.1037 9.95359C25.2499 8.09502 22.2253 8.09502 20.3552 9.95359L16.9729 13.3152L20.3552 16.6768Z" className="fill-white"></path>
                <path d="M48.1137 3.474C48.5097 3.87 48.9717 4.068 49.5327 4.068C50.0937 4.068 50.5557 3.87 50.9517 3.474C51.3477 3.078 51.5457 2.616 51.5457 2.055C51.5457 1.494 51.3477 1.032 50.9517 0.636C50.5557 0.239999 50.0937 0.0419996 49.5327 0.0419996C48.9717 0.0419996 48.5097 0.239999 48.1137 0.636C47.7177 1.032 47.5197 1.494 47.5197 2.055C47.5197 2.616 47.7177 3.078 48.1137 3.474ZM48.1467 7.17V24H50.9517V7.17H48.1467ZM55.327 7.17V24H58.132V14.529C58.132 13.638 58.33 12.78 58.726 11.955C59.122 11.13 59.65 10.47 60.376 9.942C61.102 9.447 61.894 9.183 62.818 9.183C64.105 9.183 65.128 9.546 65.887 10.239C66.613 10.965 67.009 12.087 67.009 13.638V24H69.814V13.209C69.814 11.196 69.253 9.612 68.197 8.424C67.141 7.236 65.59 6.642 63.577 6.642C62.422 6.642 61.333 6.939 60.343 7.533C59.32 8.127 58.594 8.82 58.132 9.645H58V7.17H55.327ZM85.8778 3.474C86.2738 3.87 86.7358 4.068 87.2968 4.068C87.8578 4.068 88.3198 3.87 88.7158 3.474C89.1118 3.078 89.3098 2.616 89.3098 2.055C89.3098 1.494 89.1118 1.032 88.7158 0.636C88.3198 0.239999 87.8578 0.0419996 87.2968 0.0419996C86.7358 0.0419996 86.2738 0.239999 85.8778 0.636C85.4818 1.032 85.2838 1.494 85.2838 2.055C85.2838 2.616 85.4818 3.078 85.8778 3.474ZM75.4498 9.711V24H78.2548V9.711H85.9108V24H88.7158V7.17H78.2548V5.652C78.2548 4.728 78.5188 4.035 79.0468 3.507C79.5748 2.979 80.2018 2.715 80.9278 2.715C81.3898 2.715 81.8188 2.781 82.1818 2.88C82.5118 2.979 82.9078 3.111 83.3038 3.243V0.504C82.5778 0.239999 81.7528 0.107999 80.8288 0.107999C79.8388 0.107999 78.9148 0.339 78.1228 0.767998C77.2978 1.197 76.6378 1.791 76.1758 2.583C75.6808 3.375 75.4498 4.299 75.4498 5.355V7.17H72.3478V9.711H75.4498ZM93.0966 7.17V24H95.9016V14.529C95.9016 13.638 96.0996 12.78 96.4956 11.955C96.8916 11.13 97.4196 10.47 98.1456 9.942C98.8716 9.447 99.6636 9.183 100.588 9.183C101.875 9.183 102.898 9.546 103.657 10.239C104.383 10.965 104.779 12.087 104.779 13.638V24H107.584V13.209C107.584 11.196 107.023 9.612 105.967 8.424C104.911 7.236 103.36 6.642 101.347 6.642C100.192 6.642 99.1026 6.939 98.1126 7.533C97.0896 8.127 96.3636 8.82 95.9016 9.645H95.7696V7.17H93.0966ZM113.512 23.802C114.469 24.297 115.558 24.528 116.812 24.528C118 24.528 119.089 24.264 120.079 23.67C121.036 23.109 121.762 22.416 122.257 21.591H122.389V24H125.062V13.341C125.062 11.295 124.402 9.645 123.115 8.457C121.795 7.269 120.013 6.642 117.736 6.642C116.317 6.642 115.03 6.939 113.875 7.5C112.687 8.094 111.796 8.886 111.136 9.876L113.248 11.46C113.71 10.734 114.337 10.173 115.129 9.777C115.921 9.381 116.812 9.15 117.736 9.15C119.056 9.15 120.178 9.546 121.069 10.305C121.927 11.064 122.389 12.054 122.389 13.308V14.331C121.927 14.067 121.234 13.803 120.376 13.572C119.518 13.374 118.561 13.242 117.571 13.242C115.525 13.242 113.809 13.77 112.489 14.76C111.136 15.75 110.476 17.136 110.476 18.918C110.476 20.007 110.74 20.964 111.268 21.822C111.796 22.68 112.522 23.34 113.512 23.802ZM119.716 21.327C118.891 21.822 118 22.053 117.076 22.053C115.987 22.053 115.096 21.789 114.403 21.195C113.677 20.634 113.347 19.875 113.347 18.951C113.347 17.961 113.71 17.136 114.502 16.476C115.294 15.849 116.449 15.519 118 15.519C118.858 15.519 119.65 15.651 120.442 15.849C121.201 16.08 121.861 16.377 122.389 16.707C122.389 17.697 122.125 18.588 121.663 19.38C121.168 20.205 120.508 20.865 119.716 21.327Z" className="fill-white"></path>
              </svg>
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
