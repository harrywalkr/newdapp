export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="mx-auto" />
      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            href="/"  // Assuming this links back to the homepage
            className="font-bold text-xl flex items-center space-x-2"
          >
            <span>DexTrading</span>
          </a>
        </div> 

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>
          {/* Link directly to your social media pages */}
          <a href="https://github.com/yourusername" className="opacity-60 hover:opacity-100">Github</a>
          <a href="https://twitter.com/yourusername" className="opacity-60 hover:opacity-100">Twitter</a>
          <a href="https://dribbble.com/yourusername" className="opacity-60 hover:opacity-100">Dribbble</a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <a href="/platforms/web" className="opacity-60 hover:opacity-100">Web</a>
          <a href="/platforms/mobile" className="opacity-60 hover:opacity-100">Mobile</a>
          <a href="/platforms/desktop" className="opacity-60 hover:opacity-100">Desktop</a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <a href="/about/features" className="opacity-60 hover:opacity-100">Features</a>
          <a href="/about/pricing" className="opacity-60 hover:opacity-100">Pricing</a>
          <a href="/faq" className="opacity-60 hover:opacity-100">FAQ</a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Community</h3>
          <a href="https://www.youtube.com/channel/yourchannel" className="opacity-60 hover:opacity-100">YouTube</a>
          <a href="https://discord.gg/yourdiscord" className="opacity-60 hover:opacity-100">Discord</a>
          <a href="https://twitch.tv/yourtwitch" className="opacity-60 hover:opacity-100">Twitch</a>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; {new Date().getFullYear()} DexTrading. All rights reserved.
        </h3>
      </section>
    </footer>
  );
};
