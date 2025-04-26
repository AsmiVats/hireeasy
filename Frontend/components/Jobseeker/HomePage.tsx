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
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="mb-6 text-[45px] font-semibold">
        <span className="text-[#13B5CF]">Unlock Access</span> to Vetted Service<span className="text-[#13B5CF]">Now</span> to Vetted ServiceNow Talent
        </h1>
        <p className="mx-auto mb-8 max-w-[690px] text-[#293E40] text-[20px]">
          Hiring the right ServiceNow professionals is essential for driving digital transformation. Our platform is designed to give you peace of mind by connecting you with pre-vetted candidates who are ready to deliver.
        </p>
        <Link 
          href="/find-talent"
          className="inline-block rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:opacity-90 mr-10"
        >
          Search Talent
        </Link>
        <Link 
          href="/employerprofile"
          className="inline-block rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:opacity-90"
        >
          Create Profile
        </Link>
      </div>

      {/* Features Grid */}
      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
        {features.map((feature, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-2 text-xl font-semibold text-[#1E1E1E]">{feature.title}</h3>
            <p className="mb-2 text-[#13B5CF]">{feature.description}</p>
            <p className="text-sm text-[#293E40]">{feature.subText}</p>
          </div>
        ))}
      </div>

      {/* Premium Features */}
      <div className="mt-20 bg-[#F5F6F8] p-[30px]">
        <h2 className="mb-12 text-[15px] font-normal text-[#1E1E1E]">PREMIUM FEATURES</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 min-w-[550px] mb-[60px]">
          {premiumFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start gap-4 bg-white relative pt-[20px] pl-[40px] mb-[40px] pb-[20px]">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#13B5CF] text-white absolute left-[-21px] top-[32px]">
                {feature.id}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium text-[#1E1E1E]">{feature.title}</h3>
                <p className="text-[#293E40]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerHomePage;