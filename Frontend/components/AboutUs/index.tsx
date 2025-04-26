import React from "react";
import Image from "next/image";
import HCLlogo from "../../asset/companylogo/hcltech.jpeg";
import TCSLogo from "../../asset/companylogo/tcs-tata-consultancy-services2792.logowik.com.webp";
import CapegeminiLogo from "../../asset/companylogo/capgemini-blue9300.logowik.com.webp";
import InfosysLogo from "../../asset/companylogo/infosys2157.jpg";
import WiproLogo from "../../asset/companylogo/wipro4247.logowik.com.webp";


const AboutUsComp = () => {
  const navigationItems = ["Our mission", "About us", "Success stories", "Clients"];

  const logos  = [
      {
        id: 1,
        logo: HCLlogo,
        alt: "HCL Technologies",  
      },  
      {
        id: 2,
        logo: TCSLogo,
        alt: "TCS",     
      }, 
      {
        id: 3,
        logo: CapegeminiLogo,
        alt: "Capegemini",
      },
      {
        id: 4,
        logo: InfosysLogo,
        alt: "Infosys",
      },
      {
        id: 5,
        logo: WiproLogo,
        alt: "Wipro",
      },
  ]
  const successStories = [
    {
      id: 1,
      title: "How we helped a top-tier ServiceNow",
      description: "How we helped a top-tier ServiceNow Implementation partner hire a specialized team of developers within 2 weeks, leading to the successful launch of a critical client project",
    },
    {
      id: 2,
      title: "A mid-career professional transitioned into a new ServiceNow role",
      description: "through our platform after receiving targeted interview coaching and resume optimization, resulting in a 30% increase in their salary.",
    },
    {
      id: 3,
      title: "We streamlined the hiring process for a healthcare client",
      description: "How we streamlined the hiring process for a healthcare client, reducing time-to-hire by 40% with pre-vetted talent.",
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-2 sm:px-4 py-6 sm:py-8">
      {/* Navigation Bar */}
      <nav className="mb-8 sm:mb-12 flex flex-col sm:flex-row rounded-sm justify-start sm:justify-center items-start sm:items-center gap-3 sm:gap-5 p-4 sm:p-4 text-white bg-gradient-to-b from-[#13B5CF] to-[#006845]">
        {navigationItems.map((item, index) => (
          <React.Fragment key={index}>
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-base sm:text-[20px] hover:opacity-80"
            >
              {item}
            </a>
            {index < navigationItems.length - 1 && (
              <span className="hidden sm:block h-1.5 w-1.5 rounded-full bg-white opacity-70"></span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Mission Section */}
      <section className="mb-6 sm:mb-[30px] bg-white p-4 sm:p-[30px]" id="our-mission" >
        <h1 className="mb-4 sm:mb-6 text-xl sm:text-[26px] font-medium">
          <span className="text-[#13B5CF]">Our Mission:</span> Empowering Service<span className="text-[#13B5CF]">Now</span> Careers and Businesses
        </h1>
        <p className="mb-4 sm:mb-6 text-base sm:text-[18px] text-[#5A5A5A]">
          At Hireeasy, our mission is to <span className="text-[#5A5A5A]">empower organizations and professionals within the ServiceNow ecosystem</span> by providing seamless access to verified talent and meaningful opportunities. We aim to build lasting partnerships by aligning top-tier professionals with organizations that value expertise and innovation.
        </p>
        <p className="text-base sm:text-[18px] text-[#5A5A5A]">
          Through automation, advanced matching algorithms, and a focus on community, we strive to create a platform that <span className="text-[#5A5A5A]">promotes growth, nurtures talent, and drives success for both employers and job seekers</span>.
        </p>
      </section>

      {/* About Us Section */}
      <section className="mb-6 sm:mb-[30px] bg-white p-4 sm:p-[30px]" id="about-us">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-[26px] font-medium">About us</h2>
        <p className="mb-4 sm:mb-6 text-base sm:text-[18px] text-[#5A5A5A]">
          At Hireeasy, we specialize in delivering exceptional staffing solutions by bridging the gap between skilled ServiceNow professionals and businesses that rely on innovative IT services. With extensive experience in the ServiceNow ecosystem, we have become the go-to platform for ServiceNow professionals and employers alike.
        </p>
        <p className="mb-4 sm:mb-6 text-base sm:text-[18px] text-[#5A5A5A]">
          Our expertise lies in identifying and matching top-tier talent with leading organizations, ensuring long-term success for both employers and job seekers. We are more than just a job board.
        </p>
        <p className="text-base sm:text-[18px] text-[#13B5CF]">
          "we are a community fostering growth, innovation, and opportunities within the ServiceNow space"
        </p>
      </section>

      {/* Clients Section */}
      <section id="clients" className="mb-6 sm:mb-[30px] bg-white p-4 sm:p-[30px]">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-[26px] font-medium">Our clients</h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-[18px] text-[#5A5A5A]">
          At Hireeasy, we pride ourselves on making impactful connections between ServiceNow professionals and the organizations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {logos.map((logo) => (
            <div key={logo.id} className="h-[70px] sm:h-[100px] rounded-sm border border-gray-200 p-2 sm:p-[10px]">
              <Image src={logo.logo.src} width={100} height={100} alt={logo.alt} className="h-full w-full object-cover"  />
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="mb-6 sm:mb-[30px] bg-white p-4 sm:p-[30px]" id="success-stories" >
        <h2 className="mb-6 sm:mb-8 text-xl sm:text-[26px] font-medium">Success Stories</h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-[18px] text-[#293E40]">
          At Hireeasy, we pride ourselves on making impactful connections between ServiceNow professionals and the organizations that need their skills. Let our success stories become your reality. Real Success Stories: Where Talent Meets Opportunity.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
          {successStories.map((story) => (
            <div key={story.id} className="rounded-md border border-gray-200 p-4 sm:p-6">
              <p className="mb-2 sm:mb-4 text-base sm:text-[17px] font-medium text-[#13B5CF]">
                {story.title}
              </p>
              <p className="text-xs sm:text-[13px] text-[#5A5A5A]">{story.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUsComp;