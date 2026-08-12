import paytmLogo from "../assets/paytm.png";
import securityImg from "../assets/security.webp";

const SplashScreen = () => {
  return (
    <section className="bg-white h-screen flex flex-col items-center justify-center relative">
      <div className="max-w-[250px] flex items-center justify-center">
        <img className="w-full" src={paytmLogo} alt="" />
      </div>
      <div className="flex flex-col items-center justify-center absolute top-[75%]">
        <img className="w-[70px] h-[70px]" src={securityImg} alt="" />
        <h3 className="text-center font-semibold max-w-[100px]">
          100% SECURE PAYMENTS
        </h3>
      </div>
    </section>
  );
};

export default SplashScreen;
