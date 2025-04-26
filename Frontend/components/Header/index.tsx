/* eslint-disable */
// @ts-nocheck
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import menuDataJobSeeker from "./menuData";
import { menuData } from "./menuData";
import { authService } from "@/utils/authService";
import { useRouter } from "next/navigation";

// Add these imports at the top
import LoginModal from "@/components/Auth/LoginModal";
import SignupModal from "@/components/Auth/SignupModal";
import { BookDemoModal } from "@/components/BookDemo/BookDemoModal";
import { SignUpStepOne } from "../Signup";
import { SignUpStepTwo } from "../Signup";

// Add to imports
import { ResetPasswordModal } from "@/components/Auth/ResetPasswordModal";
import HelpDesk from "../HelpDesk/HelpDesk";
import { isEmployer } from "@/utils/authUtils";

const Header = () => {
  // Add these state declarations with other states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [showLoggedin, setShowLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();
  const [isCandidateHOme, setCandidateHome] = useState(false);
  const [renderedMenu, setRenderedMenu] = useState(menuData);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user } = useUser();
  // Add state for reset password modal
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  // Add state for mobile submenu items
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(isAuthenticated);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (accountDropdownOpen && !(e.target as Element).closest(".relative")) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [accountDropdownOpen]);

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
  
  // Toggle mobile submenu
  const toggleMobileSubmenu = (id) => {
    if (mobileSubmenuOpen === id) {
      setMobileSubmenuOpen(null);
    } else {
      setMobileSubmenuOpen(id);
    }
  };

  return (
    <>
      <header
        className={`header w-full py-4 transition-all duration-300 ${
          stickyMenu
            ? "fixed left-0 top-0 z-50 animate-slideDown bg-[#F5F6F8] shadow-md"
            : "relative"
        }`}
      >
        <div className="relative mx-auto w-full items-center justify-between px-[30px] md:px-[30px] xl:flex">
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

          {/* Nav Menu Start - Desktop version remains unchanged */}
          <div
            className={`w-1/8 invisible h-0 items-center justify-between xl:visible xl:flex xl:h-auto xl:bg-transparent ${
              !navigationOpen && "xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
            }`}
          >
            <nav>
              <ul className="flex flex-col gap-5 text-lg font-medium xl:flex-row xl:items-center xl:gap-5">
                {menuData.map((menuItem) => (
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
                            <li key={key} className="hover:text-primary">
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
                      <>
                        {menuItem.id === 2.1 ? (
                          <div>Hello</div>
                        ) : (
                          <Link
                            href={menuItem.path || "#"}
                            className="pr-[20px] text-[15px] font-medium text-[#1E1E1E] hover:text-primary"
                          >
                            {menuItem.title}
                          </Link>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="flex">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/employerhome");
                    }}
                    className="pl-[20px] pr-[20px] text-[15px] font-medium text-primary hover:text-primary"
                  >
                    For Employers
                  </button>
                  {!user?.subscription?.features?.resumeViews?.limit > 0 && (
                    <button
                      onClick={() => setIsBookDemoOpen(true)}
                      className="pl-[20px] pr-[20px] text-[15px] font-medium text-primary hover:text-primary"
                    >
                      Book a Demo
                    </button>
                  )}
                  {
                    isEmployer() && (
                      <button
                    onClick={() => {
                      router.push("/find-talent");
                    }}
                    className="pl-[20px]  pr-[20px] text-[15px] font-medium text-[#1E1E1E] hover:text-primary"
                  >
                    Search Talent
                  </button>
                    )
                  }
                  
                  {
                    isEmployer() && (

                  <button
                    onClick={() => {
                      router.push("/employerprofile");
                    }}
                    className="pl-[20px] pr-[20px] text-[15px] font-medium text-[#13B5CF] hover:text-primary"
                  >
                    Post a Job
                  </button>
                    )
                  }
                  <div className="relative z-999">
                    <button
                      onClick={() =>
                        setAccountDropdownOpen(!accountDropdownOpen)
                      }
                      className="flex items-center gap-1 pl-[20px] font-medium text-primary hover:text-primary"
                    >
                      {user?.name ? (
                        user.name
                      ) : (
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                      )}
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform ${
                          accountDropdownOpen ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 top-[35px] mt-2 w-48  bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-[10px]" role="menu">
                          <button
                            onClick={() =>
                              router.push("/dashboardhome?tab=jobs")
                            }
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Jobs
                          </button>
                          <button
                            onClick={() =>
                              router.push("/dashboardhome?tab=candidates")
                            }
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Candidates
                          </button>
                          <button
                            onClick={() =>
                              router.push("/dashboardhome?tab=messages")
                            }
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Messages
                          </button>
                          <button
                            onClick={() =>
                              router.push("/dashboardhome?tab=settings")
                            }
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() =>
                              router.push("/dashboardhome?tab=settings")
                            }
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Settings
                          </button>
                          <button
                            onClick={() => setIsHelpDeskOpen(true)}
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Help
                          </button>
                          <button
                            onClick={handleLogout}
                            className="block w-full py-[10px] pl-4 pr-[27px] text-right text-[15px] font-medium text-[#1E1E1E] hover:bg-[#5A5A5A] hover:text-white"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className=" font-medium text-[#13B5CF] hover:text-primary"
                    style={{ fontSize: "15px" }}
                  >
                    Login
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Mobile Menu - with submenu functionality like in the second code but styled like the image */}
        {navigationOpen && (

  <div className="fixed inset-0 z-50 xl:hidden">
    <div className="absolute right-0 top-0 h-full w-[80%] max-w-[320px] overflow-y-auto bg-white text-black shadow-lg flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-300 p-4">
        <div className="text-lg font-semibold">Menu</div>
        <button
          onClick={() => setNavigationOpen(false)}
          className="text-xl font-bold text-black"
        >
          ×
        </button>
      </div>

      <div className="py-2">
        {menuData.map((menuItem) => (
          <div key={menuItem.id} className="px-4 border-gray-200">
            {menuItem.submenu ? (
              <>
                <button
                  onClick={() => toggleMobileSubmenu(menuItem.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-black hover:bg-gray-100"
                >
                  <span>{menuItem.title}</span>
                  <svg
                    className={`h-4 w-4 transform transition-transform ${
                      mobileSubmenuOpen === menuItem.id ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {mobileSubmenuOpen === menuItem.id && (
                  <div className="bg-gray-100 ">
                    {menuItem.submenu.map((subItem, idx) => (
                      <Link
                        key={idx}
                        href={subItem.path || "#"}
                        className="block px-8 py-2 text-sm text-black hover:bg-gray-200"
                        onClick={() => setNavigationOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={menuItem.path || "#"}
                className="block px-4 py-3 text-black hover:bg-gray-100"
                onClick={() => setNavigationOpen(false)}
              >
                {menuItem.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile actions section */}
      <div className=" px-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => {
                setNavigationOpen(false);
                router.push("/employerhome");
              }}
              className="block w-full px-4 py-3 text-left text-black hover:bg-gray-100"
            >
              For Employers
            </button>
            <button
              onClick={() => {
                setNavigationOpen(false);
                router.push("/employerprofile");
              }}
              className="block w-full px-4 py-3 text-left text-black hover:bg-gray-100"
            >
              Post a Job
            </button>
            <button
              onClick={() => {
                setNavigationOpen(false);
                router.push("/find-talent");
              }}
              className="block font-medium w-full px-4 py-3 text-left text-black hover:bg-gray-100"
            >
              Search Talent
            </button>

            {/* Account Section */}
            <div className="  pb-4 ">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-black hover:bg-gray-100"
              >
                <span>Account</span>
                <svg
                  className={`h-4 w-4 transform transition-transform ${
                    accountDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {accountDropdownOpen && (
                <div className="bg-white py-1">
                  {[
                    { title: "Jobs", tab: "jobs" },
                    { title: "Candidates", tab: "candidates" },
                    { title: "Messages", tab: "messages" },
                    { title: "Profile", tab: "settings" },
                    { title: "Settings", tab: "settings" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setNavigationOpen(false);
                        router.push(`/dashboardhome?tab=${item.tab}`);
                      }}
                      className="block w-full px-6 py-2 text-left text-sm text-black hover:bg-gray-100"
                    >
                      {item.title}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setNavigationOpen(false);
                      setIsHelpDeskOpen(true);
                    }}
                    className="block w-full px-6 py-2 text-left text-sm text-black hover:bg-gray-100"
                  >
                    Help
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setNavigationOpen(false);
                handleLogout();
              }}
              className="block w-full rounded bg-gray-800 py-2 text-center text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setNavigationOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="block w-full rounded bg-[#13B5CF] py-2 text-center text-white"
          >
            Login
          </button>
        )}
      </div>
    </div>
  </div>
)}

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
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />

      <HelpDesk
        isOpen={isHelpDeskOpen}
        onClose={() => setIsHelpDeskOpen(false)}
      />
    </>
  );
};

export default Header;