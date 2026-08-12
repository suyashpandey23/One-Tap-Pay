import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BalanceSkeleton = () => {
  return (
    <div className="flex">
      <Skeleton width={100} height={24} className="mr-4" />
      <Skeleton width={60} height={24} />
    </div>
  );
};

export default BalanceSkeleton;
