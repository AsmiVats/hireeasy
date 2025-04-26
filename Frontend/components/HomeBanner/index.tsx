"use client";
import { useRouter } from "next/navigation";

const HeroBanner = () => {
  const router = useRouter();
    return (
      <section className="flex items-center justify-center w-full h-auto min-h-[85vh] sm:h-[87vh] px-4">
        <div className="text-center w-full">
          <h1 className="text-2xl sm:text-4xl md:text-[45px] font-bold mb-6 sm:mb-12 leading-[56px] sm:leading-[50px]">
            <span className="text-[#13B5CF]">One Stop Solution</span> For All Your<br />
            <span className="text-gray-900">
              Service<span className="text-[#13B5CF]">Now</span> Requirement
            </span>
            <div className="text-gray-900 mt-2"></div>
          </h1>
          
          <div className="flex flex-row items-center justify-center gap-6 sm:gap-12 w-full max-w-md mx-auto">
            <button
              className="bg-primary text-white px-6 py-2 sm:px-8 rounded-sm hover:bg-[#009951] transition-colors w-full sm:w-auto"
              onClick={() => {
                router.push("/search-jobs");
              }}
            >
              Search Jobs
            </button>
            <button
              className="bg-primary text-white px-6 py-2 sm:px-8 rounded-sm hover:bg-[#009951] transition-colors w-full sm:w-auto"
              onClick={() => {
                router.push("/find-talent");
              }}
            >
              Search Talent
            </button>
          </div>
        </div>
      </section>
    );
  };
  
  export default HeroBanner;