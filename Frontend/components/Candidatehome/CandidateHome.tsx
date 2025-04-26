import Link from "next/link";
import FeatureCard from "./FeatureCard";
const CandidateHome = () => {
  return (
    <div className="mx-auto mt-24 text-center px-[30px] py-[30px]">
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">
        <span className="text-navy-900">Find </span>
        <span className="text-[#13B5CF]">Best Suitable jobs</span>
        <span className="text-navy-900">, "Faster Than Ever!"</span>
      </h1>

      <p className="mb-8 text-gray-600">
        Join thousands of companies hiring smarter with Hireeasy
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/search-jobs"
          className="rounded-sm bg-primary px-6 py-2 text-white transition-colors hover:bg-[#009951]"
        >
          Search Jobs
        </Link>
        <Link
          href="/jobseekers/buildprofile"
          className="rounded-sm bg-b px-6 py-2 bg-primary text-white transition-colors hover:bg-[#009951]"
        >
          Build Profile
        </Link>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-4">
        <FeatureCard
          title="Preminum Access"
          subtitle="Increased visibility to employers"
          description="visibility in front of top ServiceNow employers actively seeking qualified professionals."
        />
        <FeatureCard
          title="Self Tailored Profile"
          subtitle="Highlights your personality"
          description="A profile that showcases more than just a resume—highlighting your personality, soft skills, and experience through video"
        />
        <FeatureCard
          title="Guide from Experts"
          subtitle="Driving results for organization"
          description="A fully guided process with expert recruiters helping to match you with the right opportunities."
        />
        <FeatureCard
          title="Exclusive Job Listings"
          subtitle="Roles tailored to their expertise"
          description="For ServiceNow professionals looking for roles tailored to their expertise."
        />
      </div>

      <div className="mt-16 bg-[#F5F6F8] p-10">
        <h2 className="mb-8 text-left text-sm font-semibold text-[#293E40]">
          PREMIUM FEATURES
        </h2>
        <div className="grid gap-8 md:grid-cols-2 ">
          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                01
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Career Summaries</h3>
              <p className="text-gray-600">
                A brief but comprehensive overview of your career, tailored for
                the specific needs of employers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                02
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">LinkedIn Integration</h3>
              <p className="text-gray-600">
                Employers would have direct access to your LinkedIn profiles for
                deeper insight into your professional backgrounds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                03
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Video Introductions</h3>
              <p className="text-gray-600">
                A 20-second self-introduction video allows you to present your
                personalities and communication skills upfront.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                04
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">User-Friendly Interface</h3>
              <p className="text-gray-600">
                Search, filter, and browse through job listings with ease.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                05
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Custom Job Alerts</h3>
              <p className="text-gray-600">
                Both candidates and employers can set up notifications for new
                matches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-2 text-left">
            <div className="relative w-5">
              <div className="absolute -left-6 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#13B5CF] text-white">
                06
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Secure Contact</h3>
              <p className="text-gray-600">
                Employers can express interest and get in touch with you
                directly via the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHome;
