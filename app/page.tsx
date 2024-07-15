import Insight from "@/components/features/homepage/insight/Insight";
import HomepageTabs from "@/components/features/homepage/homepage-tabs/Homepage-tabs";

export default async function Home() {

  return (
    <div className="w-full">
      <Insight />
      <HomepageTabs />
    </div>
  );
}
