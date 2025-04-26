"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import menuDataJobSeeker from "./menuData";
import { menuData } from "./menuData";
import { authService } from "@/utils/authService";
import { useRouter } from "next/navigation";

// Add to imports
import LoginModal from "@/components/Auth/LoginModal";
import SignupModal from '@/components/Auth/SignupModal';

const HeaderJobSeekers = () => {
  // Add this state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [showLoggedin, setShowLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();
  const [isCandidateHOme, setCandidateHome] = useState(false);
  const [renderedMenu, setRenderedMenu] = useState(menuData);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(isAuthenticated);
    }
  }, [isAuthenticated]);

  const getPage = () => {
    const isCandidateHome = window.sessionStorage.getItem("currentPage");
    const isEmployerHOme = window.sessionStorage.getItem("currentPage");
    if (isCandidateHome === "candidatehome") {
      setCandidateHome(true);
    }
    if (isEmployerHOme === "home") {
      setCandidateHome(false);
    }
  };

  useEffect(() => {
    getPage();
    if (isCandidateHOme === true) {
      setRenderedMenu(menuDataJobSeeker);
    } else {
      setRenderedMenu(menuData);
    }
  }, [isCandidateHOme]);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    router.push("/");
  };

  const pathUrl = usePathname();

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 30) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  const checkIsLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <>
      <header
        className={`left-0 top-0 z-99999 w-full header`}
      >
        <div className="relative mx-auto items-center justify-between px-4 md:px-8 xl:flex">
          <div className="flex w-full items-center justify-between xl:w-1/4">
            <a href="/">
              <Image
                src="/images/logo/logo.svg"
                alt="logo"
                width={120}
                height={40}
                className="hidden w-full dark:block"
              />
              <Image
                src="/images/logo/logo.svg"
                alt="logo"
                width={120}
                height={40}
                className="w-full dark:hidden"
              />
            </a>

            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-label="hamburger Toggler"
              className="block xl:hidden"
              onClick={() => setNavigationOpen(!navigationOpen)}
              type="button"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="absolute right-0 block h-full w-full">
                  <span
                    className={`delay-[0] relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                      !navigationOpen ? "!w-full delay-300" : "w-0"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                      !navigationOpen ? "delay-400 !w-full" : "w-0"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                      !navigationOpen ? "!w-full delay-500" : "w-0"
                    }`}
                  ></span>
                </span>
                <span className="du-block absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                      !navigationOpen ? "delay-[0] !h-0" : "h-full"
                    }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                      !navigationOpen ? "!h-0 delay-200" : "h-0.5"
                    }`}
                  ></span>
                </span>
              </span>
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}
          </div>

          {/* Nav Menu Start   */}
          <div
            className={`w-1/8 invisible h-0 items-center justify-between xl:visible xl:flex xl:h-auto ${
              navigationOpen &&
              "navbar !visible mt-4 h-auto max-h-[400px] rounded-sm bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
            }`}
          >
            <nav>
              <ul className="flex flex-col font-medium xl:flex-row xl:items-center xl:gap-5">
                {menuDataJobSeeker.map((menuItem) => (
                  <li
                    key={menuItem.id}
                    className={menuItem.submenu && "group relative"}
                  >
                    {menuItem.submenu ? (
                      <>
                        <button
                          onClick={() => setDropdownToggler(!dropdownToggler)}
                          className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                        >
                          {menuItem.title}
                          <span>
                            <svg
                              className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                          </span>
                        </button>

                        <ul
                          className={`dropdown ${
                            dropdownToggler ? "flex" : ""
                          }`}
                        >
                          {menuItem.submenu.map((item, key) => (
                            <li key={key} className="hover:text-primary opacity-60">
                              <Link
                                style={{ fontSize: "15px", color: "#1e1e1e" }}
                                href={item.path || "#"}
                              >
                                {item.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={`${menuItem.path}`}
                        style={{ fontSize: "15px", color: "#1e1e1e" }}
                        className={
                          pathUrl === menuItem.path
                            ? "text-primary hover:text-primary"
                            : "hover:text-primary"
                        }
                      >
                        {menuItem.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <nav>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="pl-[20px] text-[#1E1E1E] text-[15px] transition-colors #009951"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-[#1E1E1E] text-[15px] pl-[20px] font-medium #009951 "
              >
                Sign in
              </button>
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="text-[#1E1E1E] text-[15px] pl-[20px] font-medium  #009951"
              >
                Sign up
              </button>
            </>
          )}
            </nav>
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
};

// w-full delay-300

export default HeaderJobSeekers;
