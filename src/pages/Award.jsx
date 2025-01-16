import { useEffect, useState } from "react";
import { getPerformances } from "../services";

const Award = () => {
  const [performances, setPerformances] = useState([]);

  // Hàm tính điểm trung bình và sắp xếp performances
  const processPerformances = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return (
      data
        .map((performance) => {
          // Tính điểm trung bình của admin và user
          const averageAdmin =
            performance.admin_vote_count > 0
              ? performance.admin_score / performance.admin_vote_count
              : 0;

          const averageUser =
            performance.user_vote_count > 0
              ? performance.user_score / performance.user_vote_count
              : 0;

          // Tính điểm trung bình cuối cùng
          let finalScore = 0;
          if (!averageAdmin && averageUser) {
            finalScore = averageUser;
          } else if (averageAdmin && !averageUser) {
            finalScore = averageAdmin;
          } else if (averageAdmin && averageUser) {
            finalScore = (averageAdmin + averageUser) / 2;
          }

          // Tính tổng số lượt bình chọn
          const totalVotes =
            performance.admin_vote_count + performance.user_vote_count;

          return {
            ...performance,
            averageScore: Number(finalScore.toFixed(2)),
            totalVotes, // Thêm tổng số lượt bình chọn vào object
          };
        })
        // Sắp xếp theo điểm trung bình từ cao xuống thấp
        .sort((a, b) => {
          if (b.averageScore === a.averageScore) {
            // Nếu điểm bằng nhau, sắp xếp theo tổng lượt bình chọn
            return b.totalVotes - a.totalVotes;
          }
          return b.averageScore - a.averageScore;
        })
        // Lấy 4 tiết mục đầu tiên
        .slice(0, 4)
    );
  };

  const fetchPerformances = async () => {
    try {
      const response = await getPerformances();
      const sortedPerformances = processPerformances(response?.performances);
      setPerformances(sortedPerformances);
      console.log("Sorted performances:", sortedPerformances);
    } catch (error) {
      console.error("Error fetching performances:", error);
    }
  };

  useEffect(() => {
    fetchPerformances();
  }, []);

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px] relative"
      style={{ backgroundImage: `url('/images/BackgroundDashboard.png')` }}
    >
      <div className="bg-black/40 absolute top-0 left-0 w-full h-full z-[1]"></div>
      <div className="container mx-auto py-[40px] relative z-[2]  rounded-lg">
        <h1 className="text-2xl font-bold mb-10 text-center text-white text-3xl">
          Bảng Xếp Hạng Tiết Mục
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performances.map((performance, index) => (
            <div
              key={performance.id}
              className={`bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg ${
                index === 0
                  ? "border-2 border-yellow-400"
                  : index === 1
                  ? "border-2  border-gray-200"
                  : index === 2
                  ? "border-2 border-amber-800"
                  : "border-2 border-gray-400"
              }`}
            >
              <div className="relative">
                {/* Top 3 Badge */}
                {
                  <div
                    className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0
                        ? "bg-yellow-400"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-600"
                    }`}
                  >
                    #{index + 1}
                  </div>
                }

                {/* Performance Image */}
                <img
                  src={
                    performance.image
                      ? `https://sukien.cmsfuture.online/storage/${performance.image}`
                      : "/images/avatar.png"
                  }
                  alt={performance.title}
                  className="w-60 h-60 object-cover rounded-full mb-4 mx-auto"
                />
              </div>

              {/* Performance Info */}
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">{performance.title}</h3>
                <p className="text-gray-300 mb-1 text-xl font-semibold">
                  {performance.performer}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Điểm trung bình:</span>
                    <span className="text-xl font-bold text-yellow-400">
                      {performance.averageScore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Số lượt bình chọn ban giám khảo :</span>
                    <span className="font-semibold">
                      {performance.admin_vote_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Điểm trung bình ban giám khảo bình chọn :</span>
                    <span className="font-semibold">
                      {performance.admin_score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Số lượt bình chọn nhân viên :</span>
                    <span className="font-semibold">
                      {performance.user_vote_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Điểm trung bình nhân viên bình chọn :</span>
                    <span className="font-semibold">
                      {performance.user_score}
                    </span>
                  </div>
                </div>

                <div className="mt-4 font-semibold text-xl">
                  {index === 0
                    ? "Giải nhất"
                    : index === 1
                    ? "Giải nhì"
                    : index === 2
                    ? "Giải ba"
                    : "Khuyến khích"}
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      performance.status === 2
                        ? "bg-green-500/20 text-green-400"
                        : performance.status === 3
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {performance.status === 2
                      ? "Đang diễn ra"
                      : performance.status === 3
                      ? "Đã kết thúc"
                      : "Chưa bắt đầu"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Award;
