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
          {/* Link directly to your social media pages */}
          <a href="https://x.com/dextradingapp" className="opacity-60 hover:opacity-100">Twitter</a>
          <a href="https://t.me/dextrading" className="opacity-60 hover:opacity-100">Telegram</a>
        </div>

        {/* <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <Link href="/platforms/web" className="opacity-60 hover:opacity-100">Web</Link>
          <Link href="/platforms/mobile" className="opacity-60 hover:opacity-100">Mobile</Link>
          <Link href="/platforms/desktop" className="opacity-60 hover:opacity-100">Desktop</Link>
        </div> */}

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <Link href="/pricing" className="opacity-60 hover:opacity-100">Pricing</Link>
          <Link href="/landing-page" className="opacity-60 hover:opacity-100">FAQ</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Community</h3>
          <a href="https://www.youtube.com/@dextrading" className="opacity-60 hover:opacity-100">YouTube</a>
          <a href="https://discord.gg/yourdiscord" className="opacity-60 hover:opacity-100">Discord</a>
          <a href="https://twitch.tv/yourtwitch" className="opacity-60 hover:opacity-100">Twitch</a>
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
