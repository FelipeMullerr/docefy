import { Link } from "react-router-dom";

type NavbarProps = {
  buttonText?: string;
  buttonTo?: string;
};

function Navbar({ buttonText = "Entrar", buttonTo = "/login" }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-[#3d2c1e]">Docefy</div>
      <nav className="flex gap-8 text-[#6c5c4c] font-medium">
      </nav>
      <div className="flex gap-4">
        <Link
          to={buttonTo}
          className="inline-block border border-[#f7f3ef] text-black hover:bg-[#f7f3ef] font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-sm "
        >
          {buttonText}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
