import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getPerformances } from "../services";

const Dashboard = () => {
  const [performances, setPerformances] = useState([]);

  const fetchPerformances = async () => {
    const performances = await getPerformances();
    setPerformances(performances?.performances);
    console.log(performances?.performances);
  };
  useEffect(() => {
    fetchPerformances();
  }, []);

  // const incrementDataPoint = (index) => {
  //   setData((prevData) =>
  //     prevData.map((item, i) =>
  //       i === index ? { ...item, value: item.value + 0.5 } : item
  //     )
  //   );
  // };

  const categories = performances?.map((item) => item.performer);
  const seriesData = performances?.map((item) => {
    const averageAdmin = item.admin_score / item.admin_vote_count;
    const averageUser = item.user_score / item.user_vote_count;

    if(!averageAdmin){
      return averageUser;
    }
    if(!averageUser){
      return averageAdmin;
    }
    if(averageAdmin && averageAdmin) {
      
      return (averageAdmin + averageUser) / 2;
    }
    return 0;
  });

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px] relative"
      style={{ backgroundImage: `url('/images/BackgroundDashboard.png')` }}
    >
      <div className="bg-black/40 absolute top-0 left-0 w-full h-full z-[1]"></div>
      <div className="container mx-auto py-[40px] relative z-[2] bg-white/70 rounded-lg">
        <div className="flex justify-center items-center">
          <img src={"/images/logo.svg"} alt="logo" className="w-[70px]" />
        </div>
        <h1 className="text-2xl font-bold mt-6">TOÀN THỊNH GOT TALENT 2025</h1>
        <div id="chart" className="chart-style">
          <ReactApexChart
            options={{
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  borderRadiusApplication: "end",
                  horizontal: true,
                  barHeight: "90%",
                  dataLabels: {
                    total: {
                      style: {
                        fontSize: "15px",
                      },
                    },
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: categories,
              },
            }}
            series={[
              {
                data: seriesData,
              },
            ]}
            type="bar"
            height={650}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
};

export default Dashboard;
