import moneySVG from "../../public/money.svg";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#f0f7ff]">
      <Header />
      <main className="border-t border-[#e0e7ff] flex-1 w-full px-1 md:px-32 py-4 flex flex-col md:pt-20 lg:flex-row justify-start md:justify-start items-center md:items-start gap-1 sm:gap-5">
        <div className="flex flex-col justify-center items-center pt-16 md:pt-0 md:flex-grow px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            One-Tap Pay
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#334155] max-w-3xl">
            One-Tap Pay is a fast and intuitive money transfer app that mimics
            real-world peer-to-peer transactions. Users can sign up, log in
            securely, send money to others, view balances, and update their
            account details and see their Transaction history as well— all
            within a streamlined and modern interface. While it doesn't handle
            real money, the app accurately simulates the user experience of
            digital payment platforms, making it ideal for demonstration,
            prototyping, or learning purposes.
          </p>
          <img
            className="mt-8 w-40 sm:w-60 md:w-72"
            src={moneySVG}
            alt="Money Transfer Illustration"
          />
        </div>
        <div className="w-full lg:w-96 lg:flex-shrink-0 mt-4 md:mt-0 md:flex">
          <div className="mx-5 md:mx-0 flex flex-col gap-6 justify-center bg-white p-8 rounded-[32px] shadow-lg border border-[#e2e8f0]">
            <div className="flex flex-col">
              <label className="text-[#475569] font-medium mb-1">
                You send exactly
              </label>
              <input
                type="text"
                value={"10,000"}
                className="bg-[#f8fafc] py-3 px-4 font-semibold text-lg rounded-lg text-[#0f172a] border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition"
              />
            </div>
            <Button
              label={"Get Started"}
              onClick={handleGetStartedClick}
              className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af]"
            ></Button>
          </div>
        </div>
      </main>
      <footer className="bg-white py-8 px-4 border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                One-Tap Pay
              </h3>
              <p className="text-[#475569] text-sm">
                Fast, secure, and intuitive money transfers
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                <h4 className="font-semibold text-[#0f172a] mb-2">Features</h4>
                <ul className="text-sm text-[#475569] space-y-1">
                  <li>• Instant transfers</li>
                  <li>• Transaction history</li>
                  <li>• Account management</li>
                </ul>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h4 className="font-semibold text-[#0f172a] mb-2">Security</h4>
                <ul className="text-sm text-[#475569] space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Secure authentication</li>
                  <li>• Demo environment</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] mt-6 pt-6 text-center">
            <p className="text-[#64748b] text-sm">
              © 2025 One-Tap Pay. Demo application for educational purposes
              only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
