import { useEffect, useState } from "react";
import useSocketEvent from "../hooks/useSocket";

const Award = () => {
  // Tách thành 3 mảng riêng cho từng giải
  const [prize1List, setPrize1List] = useState([]);
  const [prize2List, setPrize2List] = useState([]);
  const [prize3List, setPrize3List] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [showCenter, setShowCenter] = useState(false);

  const {
    data: employee,
    isConnected,
    emit,
  } = useSocketEvent("employeeAward");

  const { data: noMoreData } = useSocketEvent("noMoreEmployees");

  useEffect(() => {
    if (isConnected) {
      emit("awards");
    }
  }, [isConnected, emit]);

  // Xử lý phân loại giải thưởng
  useEffect(() => {
    if (employee) {
      setCurrentEmployee(employee);
      setShowCenter(true);

      const timer = setTimeout(() => {
        setShowCenter(false);
        // Phân loại theo prize
        switch (employee?.prize) {
          case 1:
            setPrize1List((prev) => [...prev, employee]);
            break;
          case 2:
            setPrize2List((prev) => [...prev, employee]);
            break;
          case 3:
            setPrize3List((prev) => [...prev, employee]);
            break;
          default:
            break;
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [employee]);

  // const { 
  //   data: employee,
  //   isConnected 
  // } = usePusher('');

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px] relative "
      style={{ backgroundImage: `url('/images/background.png')` }}
    >
      <div className="bg-black/40 absolute top-0 left-0 w-full h-full z-[1]"></div>
      <img src={"/images/logo.svg"} alt="logo" className="w-[70px] fixed top-4 right-8 z-[2]" />
      {/* Employee ở giữa màn hình */}
      {showCenter && currentEmployee && (
        <div
          className={`
            fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-black/60 rounded-lg p-6 z-10
            transition-all duration-500 ease-in-out
            ${showCenter ? "opacity-100 scale-110" : "opacity-0 scale-90"}
          `}
        >
          <img
            className="w-[200px] h-[200px] mb-3 rounded-full shadow-lg object-cover"
            src="/images/avatar.png"
            alt="Employee"
          />
          <h3 className="text-3xl font-bold text-center text-white">
            {currentEmployee.name}
          </h3>
          <p className="text-xl text-center mt-2 text-white">
            Giải {currentEmployee.prize}
          </p>
        </div>
      )}

      <div className="container mx-auto relative z-[2]">
        <h1 className="text-2xl lg:text-4xl font-bold mt-2 text-white text-center mb-8">
          TOÀN THỊNH AWARD YEP 2025
        </h1>

        {/* Prize 1 */}
        <div className="mb-8 h-[280px]">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Giải nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {prize1List?.map((emp, index) => (
              <div
              key={index}
              className=" text-[#f1e399] rounded-lg p-4 fadeIn w-max mx-auto"
            >
              <img
                className="w-[180px] h-[180px] mb-3 mx-auto rounded-full shadow-lg object-cover"
                src="/images/avatar.png"
                alt="Employee"
              />
              <div className="text-xl font-bold">{emp.name}</div>
            </div>
            ))}
          </div>
        </div>

        {/* Prize 2 */}
        <div className="mb-8 h-[240px]">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Giải nhì
          </h2>
          <div className="flex items-center justify-center gap-8">
            {prize2List?.map((emp, index) => (
              <div
                key={index}
                className=" text-[#f1e399] rounded-lg p-4 animate-fadeIn"
              >
                <img
                  className="w-[120px] h-[120px] mb-3 mx-auto rounded-full shadow-lg object-cover"
                  src="/images/avatar.png"
                  alt="Employee"
                />
                <div className="text-xl font-bold">{emp.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prize 3 */}
        <div className=" h-[200px]">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Giải 3
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            {prize3List?.map((emp, index) => (
              <div
              key={index}
              className=" text-[#f1e399] rounded-lg p-4 animate-fadeIn w-max mx-auto"
            >
              <img
                className="w-[80px] h-[80px] mb-3 mx-auto rounded-full shadow-lg object-cover"
                src="/images/avatar.png"
                alt="Employee"
              />
              <div className="text-xl font-bold">{emp.name}</div>
            </div>
            ))}
          </div>
        </div>

        {noMoreData && (
          <div className="text-white text-center mt-4 text-xl">
            No more employees to award!
          </div>
        )}
      </div>
    </div>
  );
};

export default Award;
