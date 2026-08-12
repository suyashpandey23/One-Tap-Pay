import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HeaderSkeleton = () => {
    return (
        <header className="bg-[#163300]">
            <div className="px-1 md:px-32 py-1 flex items-center">
                <div className="flex gap-1 md:gap-2 items-center justify-start flex-grow">
                    <div className="size-14 md:size-16">
                        <Skeleton circle={true} height={64} width={64} />
                    </div>
                    <Skeleton width={100} height={30} className="rounded-full py-1 px-4" />
                </div>
                <div className="flex gap-1 md:gap-2 items-center justify-end flex-grow">
                    <Skeleton width={80} height={30} className="rounded-full py-1 px-2" />
                    <Skeleton width={100} height={30} className="rounded-full py-1 px-4" />
                </div>
            </div>
        </header>
    );
};

export default HeaderSkeleton;
