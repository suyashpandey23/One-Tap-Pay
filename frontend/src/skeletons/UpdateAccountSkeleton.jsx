import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpdateAccountSkeleton = () => {
  return (
    <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
      <div className="w-10/12 md:w-6/12">
        <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-300 rounded-md animate-pulse mb-4"></div>

          {/* Divider */}
          <div className="border-t border-[#0e0f0c1f] my-5"></div>

          {/* Form fields skeleton */}
          <div className="space-y-4">
            {/* First Name field */}
            <div className="text-left">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-1/3"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            {/* Last Name field */}
            <div className="text-left">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-1/3"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            {/* Password field */}
            <div className="text-left">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-1/2"></div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="mt-6 flex-col flex gap-3">
              <div className="h-10 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountSkeleton;
