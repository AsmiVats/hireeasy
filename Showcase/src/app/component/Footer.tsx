import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const navLinks = ["About", "Blog", "Team", "Pricing", "Contact", "Terms"];

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: <FaFacebookF className="w-6 h-6" />,
  },
  {
    name: "Instagram",
    href: "#",
    icon: <FaInstagram className="w-6 h-6" />,
  },
  {
    name: "Twitter",
    href: "#",
    icon: <FaTwitter className="w-6 h-6" />,
  },
];

function Footer() {
  return (
    <section className="bg-white">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          {navLinks.map((link) => (
            <div className="px-5 py-2" key={link}>
              <a
                href="#"
                className="text-base leading-6 text-gray-500 hover:text-gray-900"
              >
                {link}
              </a>
            </div>
          ))}
        </nav>

        <div className="flex justify-center mt-8 space-x-6">
          {socialLinks.map((social) => (
            <a
              href={social.href}
              className="text-gray-400 hover:text-gray-500"
              key={social.name}
            >
              <span className="sr-only">{social.name}</span>
              {social.icon}
            </a>
          ))}
        </div>

        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          @ 2024 HireEasy, All rights reserved, Asmi Vats (CEO).
        </p>
      </div>
    </section>
  );
}

export default Footer;
