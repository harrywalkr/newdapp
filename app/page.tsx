import Insight from "@/components/features/homepage/Insight";
import HomepageTabs from "@/components/features/homepage/Homepage-tabs";

export default async function Home() {

  return (
    <div className="w-full">
      <Insight />
      <HomepageTabs />
    </div>
  );
}
