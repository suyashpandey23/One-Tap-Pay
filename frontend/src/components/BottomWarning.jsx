import { Link } from "react-router-dom"

export function BottomWarning({label, buttonText, to}) {
    return <p className="my-3 text-sm flex items-center justify-center">
      {label}
      <Link className="pointer underline pl-1 cursor-pointer font-bold" to={to}>
        {buttonText}
      </Link>
    </p>
}
  