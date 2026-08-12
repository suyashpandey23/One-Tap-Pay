import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] border-t border-gray-700 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg tracking-widest font-semibold hover:drop-shadow-[0_0_10px_white] transition duration-300"></h3>

        <div className="flex gap-5 text-xl">
          <a
            href="https://github.com/suyashpandey23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/suyash-pandey-b79217205/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:suyashpandey145@gmail.com"
            className="hover:text-pink-400 transition duration-300"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};
