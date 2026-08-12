import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UsersSkeleton = () => {
  return (
    <>
      <div className="font-bold mt-6 text-lg">
        <Skeleton width={80} height={24} />
      </div>
      <div className="my-2">
        <Skeleton width="100%" height={40} />
      </div>
      <div className="mt-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-between">
            <div className="flex">
              <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <Skeleton circle={true} height={48} width={48} />
              </div>
              <div className="flex flex-col justify-center h-full">
                <Skeleton width={150} height={20} />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full">
              <Skeleton width={100} height={40} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UsersSkeleton;
