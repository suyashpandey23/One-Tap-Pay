import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MainSectionSkeleton = () => {
  return (
    <main className="min-h-lvh w-full px-1 md:px-32 py-4 flex flex-col md:pt-20 lg:flex-row justify-start md:justify-start items-center md:items-start gap-1 sm:gap-5 bg-[#163300]">
      <div className="flex flex-col justify-center items-center pt-20 md:pt-0 md:flex-grow">
        <Skeleton width={300} height={50} className="uppercase font-black text-center text-[#9fe870] text-5xl sm:text-[4rem]" />
        <Skeleton circle={true} height={320} width={320} className="grayscale-0 w-40 sm:w-80 mt-4" />
      </div>
      <div className="w-full mt-4 md:mt-0 md:flex md:flex-grow">
        <div className="mx-5 md:mx-0 flex md:flex-grow flex-col gap-6 justify-center bg-white p-8 rounded-[32px]">
          <Skeleton height={24} width="100%" className="mb-4" />
          <Skeleton height={48} width="100%" className="py-3 px-4 font-semibold text-lg rounded-lg text-[#0e0f0c] border-none outline-none" />
          <Skeleton width={120} height={48} className="py-3 px-4 mt-4 rounded-full" />
        </div>
      </div>
    </main>
  );
};

export default MainSectionSkeleton;
