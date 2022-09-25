import Link from 'next/link';
import { useSelector } from 'react-redux';
import React, { useRef, useEffect, useState } from "react";
import img from 'next/image';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, handleClickOutside: any) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const avatarColors = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

function digestStringIntoColor(x: string): string {
    let sum = 0;
    for (let i = 0; i < x.length; ++i) {
        sum += x.charCodeAt(i);
    }

    sum %= Object.keys(avatarColors).length;
    return (avatarColors as any)[Object.keys(avatarColors)[sum]];
}

export default function NavBar() {
    const user = useSelector((state: any) => state.user);
    const menuRef = useRef(null);
    const userAvatarRef = useRef(null);

    const [showAccountDropdownMenu, setShowAccountDropdownMenu] = useState(false);
    useOutsideAlerter(menuRef, (event: any) => {
        if (userAvatarRef.current && (userAvatarRef.current as any).contains(event.target)) {
            setShowAccountDropdownMenu(prev => !prev);
        } else {
            if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
                setShowAccountDropdownMenu(false);
            }
        }
    });

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <>
            {/* <nav role="navigation" className="nav-menu w-nav-menu" style="transform: translateY(0px) translateX(0px);">
                <div data-hover="true" data-delay="3000" className="nav-bar-dropdown w-dropdown" style="max-width: 100%;">
                    <div className="nav-dropdown w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabIndex="0">
                        <div className="icon w-icon-dropdown-toggle" aria-hidden="true"></div>
                        <div className="nav-link dropdown">Sản phẩm</div>
                    </div>
                    <nav className="dropdown-list w-dropdown-list" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0"><Link href="/chung-chi-quy" className="product-nav w-dropdown-link" tabIndex="0">Chứng chỉ quỹ</Link><Link href="/chung-khoan" className="product-nav w-dropdown-link" tabIndex="0">Chứng khoán</Link><Link href="/tich-luy" className="product-nav w-dropdown-link" tabIndex="0">Tích luỹ</Link><Link href="https://www.infina.com.vn/chung-chi-tien-gui" className="product-nav w-dropdown-link" tabIndex="0">Chứng chỉ tiền gửi</Link><Link href="https://infina.vn/gioi-thieu-bat-dong-san" className="product-nav w-dropdown-link" tabIndex="0">Bất động sản</Link></nav>
                </div>
                <Link href="https://infina.vn/blog/" className="nav-link w-nav-link" style="max-width: 100%;">Blog</Link><Link href="https://infina.vn/ho-tro/" className="nav-link w-nav-link" style="max-width: 100%;">Hỗ trợ</Link>
                <div data-hover="false" data-delay="0" className="nav-bar-dropdown w-dropdown" style="max-width: 100%;">
                    <div className="nav-dropdown w-dropdown-toggle" id="w-dropdown-toggle-1" aria-controls="w-dropdown-list-1" aria-haspopup="menu" aria-expanded="false" role="button" tabIndex="0">
                        <div className="icon w-icon-dropdown-toggle" aria-hidden="true"></div>
                        <div className="nav-link dropdown">Về chúng tôi</div>
                    </div>
                    <nav className="dropdown-list w-dropdown-list" id="w-dropdown-list-1" aria-labelledby="w-dropdown-toggle-1"><Link href="https://infina.vn/ve-chung-toi" className="product-nav w-dropdown-link" tabIndex="0">Giới thiệu</Link><Link href="https://infina.vn/bao-chi?page=1" className="product-nav w-dropdown-link" tabIndex="0">Báo chí</Link><Link href="https://careers.infina.vn/" className="product-nav w-dropdown-link" tabIndex="0">Tuyển dụng</Link><Link href="https://calendly.com/infina" className="product-nav w-dropdown-link" tabIndex="0">Liên hệ</Link></nav>
                </div>
                <Link href="https://Link.infina.link/A3yP/downloadbutton" className="button-cta w-inline-block">
                    <img src="https://uploads-ssl.webflow.com/617a6615e122ca12cc064abb/61a8d1a3d70c798f9623b32d_hero__arrow.svg" loading="lazy" alt="" className="arroww" />
                    <div className="button-text-home">Tải ứng dụng</div>
                </Link>
            </nav> */}
            <nav className="bg-[#fafafa] p-2 fixed w-full z-10 top-0 border-b-2 border-[#f0f0f0]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between">
                        <div className="flex space-x-7">
                            <div>
                                <Link href="#">
                                    <a className="flex items-center py-4 px-2">
                                        <svg className='inline-block' width="128" height="25" viewBox="0 0 128 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M37.8038 19.1656L34.9581 9.96971C34.9418 9.88891 34.9093 9.82426 34.893 9.74345L34.8605 9.64648C33.3157 4.99197 28.8926 1.63037 23.6889 1.63037C19.5911 1.63037 15.981 3.71521 13.8833 6.8667L15.5907 8.56366C15.9485 7.94952 16.3876 7.38387 16.8917 6.8667L17.2169 6.54347C17.3145 6.4465 17.412 6.3657 17.5096 6.26873C19.1683 4.83035 21.331 3.95763 23.7052 3.95763C28.9088 3.95763 33.1206 8.14346 33.1206 13.3151C33.1206 18.4868 28.9088 22.6727 23.7052 22.6727C20.2578 22.6727 17.2332 20.8303 15.607 18.0666L13.8996 19.7636C16.0135 22.9151 19.6073 24.9999 23.7052 24.9999H35.4622V19.1495H37.8038V19.1656Z" className="fill-[#2466eb]"></path>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M28.6973 8.36976C25.9492 5.63846 21.5098 5.63846 18.7616 8.36976L15.3792 11.7314L11.9969 8.36976C9.24868 5.63846 4.80931 5.63846 2.06113 8.36976C-0.687045 11.1011 -0.687045 15.5132 2.06113 18.2444C4.80931 20.9757 9.24868 20.9757 11.9969 18.2444L15.3792 14.8829L18.7616 18.2444C21.5098 20.9757 25.9492 20.9757 28.6973 18.2444C31.4292 15.5293 31.4292 11.1011 28.6973 8.36976ZM10.4032 16.6768C8.53318 18.5354 5.50855 18.5354 3.65475 16.6768C1.80095 14.8182 1.78469 11.8122 3.65475 9.96975C5.52482 8.11118 8.54944 8.11118 10.4032 9.96975L13.7856 13.3313L10.4032 16.6768ZM20.3552 16.6768C22.209 18.5354 25.2337 18.5354 27.1037 16.6768C28.9575 14.8182 28.9575 11.8122 27.1037 9.95359C25.2499 8.09502 22.2253 8.09502 20.3552 9.95359L16.9729 13.3152L20.3552 16.6768Z" className="fill-[#2466eb]"></path>
                                            <path d="M48.1137 3.474C48.5097 3.87 48.9717 4.068 49.5327 4.068C50.0937 4.068 50.5557 3.87 50.9517 3.474C51.3477 3.078 51.5457 2.616 51.5457 2.055C51.5457 1.494 51.3477 1.032 50.9517 0.636C50.5557 0.239999 50.0937 0.0419996 49.5327 0.0419996C48.9717 0.0419996 48.5097 0.239999 48.1137 0.636C47.7177 1.032 47.5197 1.494 47.5197 2.055C47.5197 2.616 47.7177 3.078 48.1137 3.474ZM48.1467 7.17V24H50.9517V7.17H48.1467ZM55.327 7.17V24H58.132V14.529C58.132 13.638 58.33 12.78 58.726 11.955C59.122 11.13 59.65 10.47 60.376 9.942C61.102 9.447 61.894 9.183 62.818 9.183C64.105 9.183 65.128 9.546 65.887 10.239C66.613 10.965 67.009 12.087 67.009 13.638V24H69.814V13.209C69.814 11.196 69.253 9.612 68.197 8.424C67.141 7.236 65.59 6.642 63.577 6.642C62.422 6.642 61.333 6.939 60.343 7.533C59.32 8.127 58.594 8.82 58.132 9.645H58V7.17H55.327ZM85.8778 3.474C86.2738 3.87 86.7358 4.068 87.2968 4.068C87.8578 4.068 88.3198 3.87 88.7158 3.474C89.1118 3.078 89.3098 2.616 89.3098 2.055C89.3098 1.494 89.1118 1.032 88.7158 0.636C88.3198 0.239999 87.8578 0.0419996 87.2968 0.0419996C86.7358 0.0419996 86.2738 0.239999 85.8778 0.636C85.4818 1.032 85.2838 1.494 85.2838 2.055C85.2838 2.616 85.4818 3.078 85.8778 3.474ZM75.4498 9.711V24H78.2548V9.711H85.9108V24H88.7158V7.17H78.2548V5.652C78.2548 4.728 78.5188 4.035 79.0468 3.507C79.5748 2.979 80.2018 2.715 80.9278 2.715C81.3898 2.715 81.8188 2.781 82.1818 2.88C82.5118 2.979 82.9078 3.111 83.3038 3.243V0.504C82.5778 0.239999 81.7528 0.107999 80.8288 0.107999C79.8388 0.107999 78.9148 0.339 78.1228 0.767998C77.2978 1.197 76.6378 1.791 76.1758 2.583C75.6808 3.375 75.4498 4.299 75.4498 5.355V7.17H72.3478V9.711H75.4498ZM93.0966 7.17V24H95.9016V14.529C95.9016 13.638 96.0996 12.78 96.4956 11.955C96.8916 11.13 97.4196 10.47 98.1456 9.942C98.8716 9.447 99.6636 9.183 100.588 9.183C101.875 9.183 102.898 9.546 103.657 10.239C104.383 10.965 104.779 12.087 104.779 13.638V24H107.584V13.209C107.584 11.196 107.023 9.612 105.967 8.424C104.911 7.236 103.36 6.642 101.347 6.642C100.192 6.642 99.1026 6.939 98.1126 7.533C97.0896 8.127 96.3636 8.82 95.9016 9.645H95.7696V7.17H93.0966ZM113.512 23.802C114.469 24.297 115.558 24.528 116.812 24.528C118 24.528 119.089 24.264 120.079 23.67C121.036 23.109 121.762 22.416 122.257 21.591H122.389V24H125.062V13.341C125.062 11.295 124.402 9.645 123.115 8.457C121.795 7.269 120.013 6.642 117.736 6.642C116.317 6.642 115.03 6.939 113.875 7.5C112.687 8.094 111.796 8.886 111.136 9.876L113.248 11.46C113.71 10.734 114.337 10.173 115.129 9.777C115.921 9.381 116.812 9.15 117.736 9.15C119.056 9.15 120.178 9.546 121.069 10.305C121.927 11.064 122.389 12.054 122.389 13.308V14.331C121.927 14.067 121.234 13.803 120.376 13.572C119.518 13.374 118.561 13.242 117.571 13.242C115.525 13.242 113.809 13.77 112.489 14.76C111.136 15.75 110.476 17.136 110.476 18.918C110.476 20.007 110.74 20.964 111.268 21.822C111.796 22.68 112.522 23.34 113.512 23.802ZM119.716 21.327C118.891 21.822 118 22.053 117.076 22.053C115.987 22.053 115.096 21.789 114.403 21.195C113.677 20.634 113.347 19.875 113.347 18.951C113.347 17.961 113.71 17.136 114.502 16.476C115.294 15.849 116.449 15.519 118 15.519C118.858 15.519 119.65 15.651 120.442 15.849C121.201 16.08 121.861 16.377 122.389 16.707C122.389 17.697 122.125 18.588 121.663 19.38C121.168 20.205 120.508 20.865 119.716 21.327Z" className="fill-[#2466eb]"></path>
                                        </svg>
                                    </a>
                                </Link>
                            </div>
                            <div className="hidden md:flex items-center space-x-1">
                                <Link href="#"><a className="py-4 px-2 text-[#2466eb] border-b-4 border-[#2466eb] font-semibold ">Home</a></Link>
                                <Link href="#"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-[#2466eb] transition duration-300">Services</a></Link>
                                <Link href="#"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-[#2466eb] transition duration-300">About</a></Link>
                                <Link href="#"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-[#2466eb] transition duration-300">Contact Us</a></Link>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-3 ">
                            <div className="relative inline-block text-left">
                                {
                                    user && user.first_name && user.middle_name && user.last_name ?
                                        <div ref={userAvatarRef} className="cursor-pointer">
                                            {user.profile_image ?
                                                <img className="px-1 w-12 h-12 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={user.profile_image} alt="Profile" />
                                                :
                                                <div className="px-1 w-12 h-12 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 text-xl text-white font-bold flex flex-row justify-center items-center" style={{ background: digestStringIntoColor(user.first_name + " " + user.middle_name + " " + user.last_name) }}>
                                                    {user.first_name.slice(0, 1)}
                                                </div>}
                                        </div>
                                        :
                                        <>
                                            <Link href="/sign-in"><a className="py-2 px-2 mr-2 font-medium text-gray-500 rounded hover:bg-[#2466eb] hover:text-white transition duration-300">Log In</a></Link>
                                            <Link href="/sign-up"><a className="py-2 px-2 font-medium text-white bg-[#2466eb] rounded hover:bg-[#2466eb] transition duration-300">Sign Up</a></Link>
                                        </>
                                }

                                <div ref={menuRef} style={showAccountDropdownMenu ? {} : { display: "none" }} className="origin-top-right absolute right-0 mt-2 w-[250px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                    <div className="" role="none">
                                        <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            <div>{user && (user.first_name + (user.middle_name ? " " + user.middle_name : "") + " " + user.last_name)}</div>
                                            <div className="font-medium truncate pt-1">{user && "@" + user.username}</div>
                                            <div className="font-medium truncate pt-1">Balance: {user && user.balance} USDT</div>
                                        </div>
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                                            <li>
                                                <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                            </li>
                                        </ul>
                                        <div className="py-1">
                                            <Link href="/logout"><a className="block py-2 px-4 text-sm w-full text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log out</a></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button className="outline-none mobile-menu-button">
                                <svg className=" w-6 h-6 text-gray-500 hover:text-[#2466eb] "
                                    x-show="!showMenu"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="hidden mobile-menu">
                    <ul className="">
                        <li className="active"><Link href="index.html" className="block text-sm px-2 py-4 text-white bg-[#2466eb] font-semibold">Home</Link></li>
                        <li><Link href="#services" className="block text-sm px-2 py-4 hover:bg-[#2466eb] transition duration-300">Services</Link></li>
                        <li><Link href="#about" className="block text-sm px-2 py-4 hover:bg-[#2466eb] transition duration-300">About</Link></li>
                        <li><Link href="#contact" className="block text-sm px-2 py-4 hover:bg-[#2466eb] transition duration-300">Contact Us</Link></li>
                    </ul>
                </div>
                {/* <script>
                    const btn = document.querySelector("button.mobile-menu-button");
                    const menu = document.querySelector(".mobile-menu");

				btn.addEventListener("click", () => {
                        menu.classList.toggle("hidden");
				});
            </script> */ }
            </nav>
        </>
    );
}