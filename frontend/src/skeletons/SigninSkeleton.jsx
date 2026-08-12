import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SigninSkeleton = () => {
  return (
    <>
      <header className="bg-[#163300]">
        <div className="px-1 md:px-32 py-1 flex items-center">
          <div className="flex gap-1 md:gap-2 items-center justify-start flex-grow">
            <Skeleton circle={true} height={24} width={24} />
            <Skeleton width={100} height={30} className="rounded-full py-1 px-4" />
          </div>
          <div className="flex gap-1 md:gap-2 items-center justify-end flex-grow">
            <Skeleton width={80} height={30} className="rounded-full py-1 px-2" />
            <Skeleton width={100} height={30} className="rounded-full py-1 px-4" />
          </div>
        </div>
      </header>
      <div className="bg-white border-t border-[#0e0f0c1f] h-screen flex justify-center items-start pt-10 sm:pt-20">
        <div className="flex flex-col justify-center w-full md:w-6/12">
          <div className="rounded-lg bg-white w-full text-center p-2 px-12 h-max">
            <Skeleton width={250} height={40} className="mb-4" />
            <Skeleton width={200} height={30} className="mb-6" />
            <Skeleton width="100%" height={40} className="mb-4" />
            <Skeleton width="100%" height={40} className="mb-4" />
            <Skeleton width="100%" height={40} className="mt-8" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninSkeleton;
