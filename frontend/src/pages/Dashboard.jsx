import { useEffect, useState } from "react";
import { Header } from "../components/Header"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from '../components/AxiosInstance'
import { Footer } from "../components/Footer";

const Dashboard = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get('/account/balance', { withCredentials: true });
                if (response.data.balance) setBalance(response.data.balance);
            } catch (error) {
                console.log('Error while fetching balance', error)
            }
        };
        fetchBalance();
    }, [])
    return (
        <div>
            <Header />
            <div className="m-8 min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh]">
                <Balance value={balance} />
                <Users />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;