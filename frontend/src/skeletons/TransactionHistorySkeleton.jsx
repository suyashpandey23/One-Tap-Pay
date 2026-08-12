import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TransactionHistorySkeleton = () => {
  return (
    <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
      <div className="w-11/12 md:w-8/12 lg:w-6/12">
        <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-300 rounded-md animate-pulse mb-4"></div>

          {/* Divider */}
          <div className="border-t border-[#0e0f0c1f] my-5"></div>

          {/* Filter buttons skeleton */}
          <div className="flex gap-2 mb-6 justify-center">
            <div className="h-10 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Transaction list skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 text-left"
              >
                {/* Transaction type and amount */}
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 bg-gray-300 rounded animate-pulse w-1/3"></div>
                  <div className="h-6 bg-gray-300 rounded animate-pulse w-20"></div>
                </div>

                {/* Description */}
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-3/4"></div>

                {/* Date and time */}
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-1/5"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Back button skeleton */}
          <div className="mt-6">
            <div className="h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;
