import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TalentAcquisitionTabs = () => {
  return (
    <Tabs defaultValue="referral" className="w-full">
      <TabsList className="flex w-fit gap-2 bg-transparent p-0">
        <TabsTrigger
          value="referral"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Key information
        </TabsTrigger>

        <TabsTrigger
          value="ta"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
         IT Team
        </TabsTrigger>

        <TabsTrigger
          value="jobs"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Job Openings
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TalentAcquisitionTabs;
