'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
                    return (
                                        <>
                                                            <footer className="footer">
                                                                                <div className="mx-auto w-full  px-[30px]">
                                                                                                    {/* <!-- Footer Bottom --> */}
                                                                                                    <div className="flex flex-col flex-wrap items-center justify-center gap-5 lg:flex-row lg:justify-between lg:gap-0">
                                                                                                                        <div>
                                                                                                                                            <p className="text-[#AEB4C1]">
                                                                                                                                                                &copy;
                                                                                                                                                                Copyright
                                                                                                                                                                Now
                                                                                                                                                                Edge{' '}
                                                                                                                                                                {new Date().getFullYear()}
                                                                                                                                                                .
                                                                                                                                                                All
                                                                                                                                                                rights
                                                                                                                                                                reserved
                                                                                                                                            </p>
                                                                                                                        </div>

                                                                                                                        <div>
                                                                                                                                            <ul className="flex items-center gap-3">
                                                                                                                                                                <li>
                                                                                                                                                                                    <Link
                                                                                                                                                                                                        href="/contactus"
                                                                                                                                                                                                        className="text-[#AEB4C1] hover:text-primary"
                                                                                                                                                                                    >
                                                                                                                                                                                                        Contact
                                                                                                                                                                                                        Us
                                                                                                                                                                                    </Link>
                                                                                                                                                                </li>
                                                                                                                                                                <li>
                                                                                                                                                                                    |
                                                                                                                                                                </li>
                                                                                                                                                                <li>
                                                                                                                                                                                    <Link
                                                                                                                                                                                                        href="/privacy-policy"
                                                                                                                                                                                                        className="text-[#AEB4C1] hover:text-primary"
                                                                                                                                                                                    >
                                                                                                                                                                                                        Privacy
                                                                                                                                                                                                        Policy
                                                                                                                                                                                    </Link>
                                                                                                                                                                </li>
                                                                                                                                                                <li>
                                                                                                                                                                                    |
                                                                                                                                                                </li>
                                                                                                                                                                <li>
                                                                                                                                                                                    <Link
                                                                                                                                                                                                        href="/terms-of-service"
                                                                                                                                                                                                        className="text-[#AEB4C1] hover:text-primary"
                                                                                                                                                                                    >
                                                                                                                                                                                                        Terms
                                                                                                                                                                                                        of
                                                                                                                                                                                                        Service
                                                                                                                                                                                    </Link>
                                                                                                                                                                </li>
                                                                                                                                            </ul>
                                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {/* <!-- Footer Bottom --> */}
                                                                                </div>
                                                            </footer>
                                        </>
                    );
};

export default Footer;
