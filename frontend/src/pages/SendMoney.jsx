import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "../components/AxiosInstance";
import { useState } from 'react';
import { useNotification } from '../notify/context/NotificationContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { InputBox } from '../components/InputBox';
import SendMoneySkeleton from '../skeletons/SendMoneySkeleton';
import { Footer } from '../components/Footer';

const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const first_name = searchParams.get('first_name');
    const last_name = searchParams.get('last_name');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const addNotification = useNotification();
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errors = {};
        if (!amount) {
            errors.amount = 'Amount cannot be empty.';
        } else if (isNaN(amount) || parseFloat(amount) <= 0) {
            errors.amount = 'Amount must be a positive number.';
        }
        return errors;
    };

    const handleTransfer = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/account/transfer', { to: id, amount: parseFloat(amount) }, { withCredentials: true });
            addNotification('success', response.data.message || 'Money sent successfully');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors({ ...errors, server: errorMessage });
            addNotification('danger', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, amount: '' }));
    };

    const handleGoBack = () => {
        navigate('/dashboard');
    }

    if (loading) {
        return <>
            <Header />
            <SendMoneySkeleton />
            <Footer />
        </>;
    }

    return (
        <>
            <Header />
            <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
                <div className="w-10/12 md:w-6/12">
                    <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
                        <h3 className="text-2xl">Send Temp Money Securly</h3>
                        <div className="border-t border-[#0e0f0c1f] my-5"></div>
                        <div className="">
                            <p className='mb-3'>You are sending to,</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#9fe870] flex items-center justify-center">
                                    <span className="text-2xl text-[#163300]">{first_name[0].toUpperCase()}</span>
                                </div>
                                <h3 className="text-2xl font-semibold">{first_name} {last_name}</h3>
                            </div>
                            <div className="mt-4">
                                <div className="">
                                    <InputBox
                                        label={"You send exactly"}
                                        onChange={handleAmountChange}
                                        value={amount}
                                        type={"number"}
                                        placeholder="1,000"
                                        error={errors.amount}
                                    />
                                </div>
                                {errors.server && <div style={{ color: 'red', textAlign: 'left' }}>{errors.server}</div>}
                                <div className="mt-4 flex-col flex gap-3">
                                    <Button onClick={handleTransfer} label={loading ? 'Processing...' : 'Initiate Transfer'}></Button>
                                    <button onClick={handleGoBack} type="button" className="w-full text-[#163300] font-bold bg-[#ffffff1a] border border-[#9fe870] transition-colors duration-150 ease-in-out text-base rounded-full select-none py-2 px-4">Cancle, Go Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SendMoney;
