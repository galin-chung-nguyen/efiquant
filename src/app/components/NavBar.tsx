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

      <nav className="bg-[#fafafa] p-2 fixed w-full z-10 top-0 border-b-2 border-[#f0f0f0]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <Link href="#">
                  <a className="flex items-center py-4 px-2">
                    <span className='text-[#2466eb] text-3xl'>@Efiquant</span>
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