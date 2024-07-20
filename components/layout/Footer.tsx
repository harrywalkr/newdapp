import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="mx-auto" />
      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            href="/"
            className="font-bold text-xl flex items-center space-x-2 font-['Fira_Code']"
          >
            <span className="text-brand2">
              Dex
            </span>
            Trading
          </a>
          <p className="max-w-52 mt-3 text-muted-foreground text-base leading-5">Empowering crypto traders uncover investment opportunities.</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>
          <a href="https://x.com/dextradingapp" className="opacity-60 hover:opacity-100">X (Twitter)</a>
          <a href="https://t.me/dextrading" className="opacity-60 hover:opacity-100">Telegram Channel</a>
          <a href="https://www.linkedin.com/company/dextrading/" className="opacity-60 hover:opacity-100">LinkedIn</a>
          <a href="https://www.youtube.com/@dextrading" className="opacity-60 hover:opacity-100">YouTube</a>
          <a href="https://www.instagram.com/dextrading_com?igsh=MXY4dDEyYTJpcGhyNw==" className="opacity-60 hover:opacity-100">Instagram</a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Company</h3>
          <Link href="/about-us" className="opacity-60 hover:opacity-100">About us</Link>
          <Link href="/pricing" className="opacity-60 hover:opacity-100">Pricing</Link>
          <Link href="/pricing" className="opacity-60 hover:opacity-100">FAQ</Link>
          <Link href="/pricing" className="opacity-60 hover:opacity-100">Contact us</Link>
          <Link href="/pricing" className="opacity-60 hover:opacity-100">Disclaimer</Link>

        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Products</h3>
          <Link href="/about-us" className="opacity-60 hover:opacity-100"></Link>

        </div>

      </section>
      {/* <Separator orientation="horizontal" flex /> */}
      <section className="container pb-14 text-center mt-10 flex items-center justify-between">
        <h3>
          &copy; {new Date().getFullYear()} DexTrading. All rights reserved.
        </h3>

      </section>
    </footer>
  );
};
