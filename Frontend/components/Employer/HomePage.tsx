import Image from "next/image";
import Link from "next/link";

const EmployerHomePage = () => {
  const features = [
    {
      title: "Curated Talent",
      description: "We don't just provide resumes",
      subText: "we offer pre-vetted, interview-ready professionals who have been carefully screened by our recruiters.",
    },
    {
      title: "Candidate Transparency",
      description: "More informed hiring decisions.",
      subText: "Along with resumes, employers gain access to career summaries, LinkedIn profiles, and video introductions",
    },
    {
      title: "Faster Time-to-Hire",
      description: "Driving results for organization.",
      subText: "With fully vetted candidates ready to engage, reduce your hiring timelines and focus on scaling your projects efficiently.",
    },
    {
      title: "Exclusive Job Listings",
      description: "Roles tailored to their expertise",
      subText: "For ServiceNow professionals looking for roles tailored to their expertise.",
    },
  ];

  const premiumFeatures = [
    {
      id: "01",
      title: "Career Summaries",
      description: "A brief but comprehensive overview of the candidate's career, tailored for the specific needs of employers.",
    },
    {
      id: "02",
      title: "LinkedIn Integration",
      description: "Direct access to candidates' LinkedIn profiles for deeper insight into their professional backgrounds.",
    },
    {
      id: "03",
      title: "Video Introductions",
      description: "A 20-second self-introduction video allows candidates to present their personalities and communication skills upfront.",
    },
    {
      id: "04",
      title: "User-Friendly Interface",
      description: "Search, filter, and browse through candidates or job listings with ease.",
    },
    {
      id: "05",
      title: "Custom Job Alerts",
      description: "Both candidates and employers can set up notifications for new matches.",
    },
    {
      id: "06",
      title: "Secure Contact",
      description: "Employers can express interest and get in touch with vetted candidates directly via the platform.",
    },
    {
      id: "07",
      title: "Quality Assured",
      description: "Assurance that every candidate is pre-screened, ensuring alignment with your organization's requirements.",
    },
    {
      id: "08",
      title: "Additional insight",
      description: "Additional insights through candidate career summaries, LinkedIn profiles, and video introductions to evaluate cultural fit before any interaction",
    },
  ];

  return (
    <div className="mx-auto py-8 sm:py-11 px-2 sm:px-6 md:px-[30px]">
      {/* Hero Section */}
      <div className="text-center mb-10 sm:mb-[60px]">
        <h1 className="mb-6 sm:mb-[25px] text-2xl sm:text-4xl md:text-[45px] font-semibold mt-10 sm:mt-[60px] leading-tight sm:leading-[53px]">
          <span className="text-[#13B5CF]">Unlock Access</span> to Vetted Service<span className="text-[#13B5CF]">Now</span> Talent
        </h1>
        <p className="mx-auto mb-8 sm:mb-[45px] max-w-[690px] text-[#293E40] text-base sm:text-[20px]">
          Hiring the right ServiceNow professionals is essential for driving digital transformation. Our platform is designed to give you peace of mind by connecting you with pre-vetted candidates who are ready to deliver.
        </p>
        <Link 
          href="/find-talent"
          className="inline-block rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:opacity-90 mr-4 sm:mr-10 globalbutton"
        >
          Search Talent
        </Link>
        <Link 
          href="/employerprofile"
          className="inline-block rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:opacity-90 globalbutton"
        >
          Create Profile
        </Link>
      </div>

      {/* Features Grid */}
      <div className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[30px]">
        {features.map((feature, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-4 sm:p-6 w-full">
            <h3 className="mb-2 text-lg sm:text-xl font-medium text-[#1E1E1E]">{feature.title}</h3>
            <p className="text-[#009951] text-base sm:text-[17px] mt-3 mb-3">{feature.description}</p>
            <p className="text-sm text-[#5A5A5A]">{feature.subText}</p>
          </div>
        ))}
      </div>

      {/* Premium Features */}
      <div className="mt-8 sm:mt-[30px] bg-[#F5F6F8] pt-4 sm:pt-[10px] pl-4 sm:pl-[60px] pr-4 sm:pr-[45px] pb-2 sm:pb-[1px] rounded-sm">
        <h2 className="mb-2 sm:mb-[10px] text-xs sm:text-[14px] font-normal text-[#1E1E1E]">PREMIUM FEATURES</h2>
        <div className="grid grid-cols-1 gap-x-6 sm:gap-x-[75px] gap-y-8 sm:gap-y-[60px] md:grid-cols-2 mb-8 sm:mb-[60px]">
          {premiumFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start gap-4 bg-white relative pt-5 sm:pt-[20px] pl-6 sm:pl-[40px] pb-5 sm:pb-[20px] max-w-full">
              <div className="flex h-10 w-10 sm:h-[42px] sm:w-[42px] items-center justify-center rounded-full bg-[#13B5CF] text-white absolute left-[-6%] sm:left-[-3.5%] top-[33%]">
                {feature.id}
              </div>
              <div className="pr-4 sm:pr-[30px]">
                <h3 className="mb-2 text-base sm:text-lg font-medium text-[#1E1E1E]">{feature.title}</h3>
                <p className="text-[#293E40] text-sm sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerHomePage;