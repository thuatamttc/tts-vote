import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Dashboard = () => {
  const [data, setData] = useState([
    { category: "South Korea", value: 6 },
    { category: "Canada", value: 5 },
    { category: "United Kingdom", value: 4 },
    { category: "Netherlands", value: 5 },
    { category: "Italy", value: 9 },
    { category: "France", value: 7 },
    { category: "Japan", value: 8 },
    { category: "United States", value: 4 },
    { category: "China", value: 7 },
    { category: "Germany", value: 4 },
  ]);

  // const incrementDataPoint = (index) => {
  //   setData((prevData) =>
  //     prevData.map((item, i) =>
  //       i === index ? { ...item, value: item.value + 0.5 } : item
  //     )
  //   );
  // };

  const categories = data.map((item) => item.category);
  const seriesData = data.map((item) => item.value);

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
            height={350}
          />
        </div>
        <div id="html-dist"></div>
       
      </div>
    </div>
  );
};

export default Dashboard;
