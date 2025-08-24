import React from "react";

import Carousel from "./Carousel";
import NextMatch from "./nextMatch";
import MiniTable from "./miniTable";

const Home = () => {

  return (
    <div className="py-5 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        <Carousel/>

        {/* Right Column */}
        <div className="flex flex-col gap-5 lg:col-span-1 md:max-h-[82svh]">
          {/* Next Match */}
            <NextMatch/>
          {/* League Table */}
            <MiniTable/>
        </div>
      </div>
    </div>
  );
};

export default Home;
