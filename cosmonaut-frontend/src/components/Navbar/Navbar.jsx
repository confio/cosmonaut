import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import LogoV4 from "../../assets/images/logo-v4.svg";
import { LoginState } from "../../core/state/loginState";
import Profile from "../Common/Profile";
import { useIsLogin } from "../../core/api/useIsLogin";

const Container = tw.div`fixed top-0 w-full z-50`;
const Logo = tw.a`text-lg font-bold ease-in-out duration-300 transform hover:scale-110`;

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const [scroll, setScroll] = useState(true);
  const [isLogin, userName, checkFetch] = useIsLogin();

  useEffect(() => {
    checkFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLogin) {
      setIsLoggedIn(isLogin);
    }
  }, [isLogin, setIsLoggedIn]);

  window.addEventListener("scroll", (e) => {
    if (window.scrollY > 1) {
      setScroll(false);
    } else {
      setScroll(true);
    }
  });

  return (
    <Container>
      <nav
        id="navbar"
        className={clsx(
          "transition delay-200 ease-in-out duration-200 hover:opacity-100 focus:opacity-100 flex justify-between items-center lg:py-3 py-2 md:px-6 xl:px-10 px-6 relative bg-gray-700 shadow-xl",
          { "opacity-0": scroll === false }
        )}
      >
        <Logo href="/">
          <img class="md:h-9 h-8 py-1" src={LogoV4} alt="" width="auto" />
        </Logo>
        {isLoggedIn ? (
          <Profile name={userName || "user_name"} />
        ) : (
          <div class="flex items-center">
            <Link to="/signUp">
              <div class="items-center">
                <div class="inline-block px-4 ml-2 text-center leading-6 text-sm text-white border-2 shadow-md transition duration-200 rounded-full py-0.5 bg-green-500 hover:bg-yellow-500 border-indigo-900 hover:text-indigo-900 font-heading ease-in-out transform hover:scale-110 ">
                  SIGN IN
                </div>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </Container>
  );
}

export default Navbar;
