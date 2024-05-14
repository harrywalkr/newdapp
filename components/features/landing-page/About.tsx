import Image from "next/image";
import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 bg-background-dark"
    >
      <div className="bg-muted/50 border rounded-lg py-12 shadow-lg">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src='/landing-page/pilot.png'
            alt=""
            width={200}
            height={200}
            className="w-[300px] object-contain rounded-lg"
          /> 
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  Empowering Crypto Traders
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                At DexTrading, we leverage cutting-edge analytics to provide deep insights into the cryptocurrency market. Our platform empowers traders by offering real-time data analysis, predictive trends, and comprehensive market reports. Whether you're a seasoned investor or new to crypto, DexTrading equips you with the tools needed to make informed decisions.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
