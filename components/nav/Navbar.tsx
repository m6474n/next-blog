import Link from "next/link";
import LoginBtn from "./LoginBtn";

export default function Navbar() {
  return (
   <nav className="flex justify-between">
<div className="group ">
<Link href="/" className="text-2xl font-bold" >Mosen's Blog</Link>   
<div className="line h-1 group-hover:w-full w-0 bg-violet-500 transition-all "></div>
</div>
<LoginBtn/>
   </nav>
  )
}
