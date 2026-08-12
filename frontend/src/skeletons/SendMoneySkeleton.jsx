import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SendMoneySkeleton = () => {
    return (
        <>
            <div className="bg-[#163300] border-t border-[#fefefe] h-screen flex justify-center items-start pt-20">
                <div className="w-10/12 md:w-6/12">
                    <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
                        <h3 className="text-2xl"><Skeleton width={200} /></h3>
                        <div className="border-t border-[#0e0f0c1f] my-5"></div>
                        <div>
                            <p className='mb-3'><Skeleton width={150} /></p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#9fe870] flex items-center justify-center">
                                    <Skeleton circle={true} height={40} width={40} />
                                </div>
                                <h3 className="text-2xl font-semibold"><Skeleton width={200} /></h3>
                            </div>
                            <div className="mt-4">
                                <div>
                                    <Skeleton width="100%" height={40} />
                                </div>
                                <div className="mt-4 flex-col flex gap-3">
                                    <Skeleton width="100%" height={40} />
                                    <Skeleton width="100%" height={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SendMoneySkeleton;
