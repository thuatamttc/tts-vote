import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import $ from "jquery";
import "./../style/lotteryWheel.css";
import clsx from "clsx";
import { TITLE_MAP } from "../constants/options";

const SlotMachine = () => {
  const [prizes, setPrizes] = useState({});
  const [notStarted, setNotStarted] = useState(true);

  const [isSpinning, setIsSpinning] = useState(false);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [tempResult, setTempResult] = useState(null);

  const [selectedPrize, setSelectedPrize] = useState(null);

  const [currentNumber, setCurrentNumber] = useState(null);

  useEffect(() => {
    const existingResults = JSON.parse(
      localStorage.getItem("lotteryResults") || "{}"
    );
    setPrizes(existingResults);
    console.log("existingResults", existingResults);
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .set(".ring", { rotationX: -90 })
      .set(".item", {
        rotateX: (i) => i * -36,
        transformOrigin: "50% 50% -220px",
        z: 220,
      })
      .to(
        "#ring1",
        {
          rotationX: gsap.utils.random(-1440, 1440, 36),
          duration: 0,
          ease: "power3",
        },
        "<="
      )
      .to(
        "#ring2",
        {
          rotationX: gsap.utils.random(-1440, 1440, 36),
          duration: 0,
          ease: "power3",
        },
        "<="
      )
      .to(
        "#ring3",
        {
          rotationX: gsap.utils.random(-1440, 1440, 36),
          duration: 0,
          ease: "power3",
        },
        "<="
      );
  }, [notStarted]);

  // Hàm tạo số ngẫu nhiên từ 1-180
  const generateRandomNumber = () => {
    // Lấy danh sách số đã trúng từ state prizes
    const usedNumbers = Object.values(prizes)
      .filter((prize) => prize?.number) // Lọc các giải đã có số
      .map((prize) => parseInt(prize.number));

    console.log("Các số đã trúng:", usedNumbers);

    // Tạo mảng các số hợp lệ từ 1-180, loại bỏ các số đã trúng
    let availableNumbers = Array.from({ length: 180 }, (_, i) => i + 1)
    .filter(num => {
      return num > 0 && num <= 180 && !usedNumbers.includes(num);
    });

  if (availableNumbers.length === 0) {
    console.error("Đã hết số để quay!");
    return null;
  }

    // Chọn ngẫu nhiên từ các số còn lại
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);


    // Format số để luôn có 3 chữ số
    const formattedNumber = randomIndex.toString().padStart(3, "0");

    // Tách thành từng chữ số
    const result = {
      formattedNumber,
      firstDigit: parseInt(formattedNumber[0]),
      secondDigit: parseInt(formattedNumber[1]),
      thirdDigit: parseInt(formattedNumber[2]),
    };

    return result;
  };

  const spinWheels = () => {
    setNotStarted(false);
    setIsSpinning(true);
    gsap.killTweensOf([".ring"]);
    setCurrentNumber(null);
    // Lấy số mục tiêu từ state hoặc tạo mới nếu cần
    const randomResult = generateRandomNumber();
    setCurrentNumber(randomResult);

    // Thêm vòng quay phụ (2-3 vòng)
    const extraRotation = 18000; // Cố định 2 vòng để đảm bảo chính xác

    // Tính góc quay cho từng số
    // Số 0 ở góc 0°, số 1 ở góc 36°, số 2 ở góc 72°, ...
    const angle1 = randomResult.firstDigit * 36;
    const angle2 = randomResult.secondDigit * 36;
    const angle3 = randomResult.thirdDigit * 36;

    // Tính góc quay cuối cùng (thêm 4° để điều chỉnh độ lệch)
    const targetRotation1 = extraRotation + angle1 + 4;
    const targetRotation2 = extraRotation + angle2 + 4;
    const targetRotation3 = extraRotation + angle3 + 4;

    // Animation dừng từ từ
    gsap.to("#ring1", {
      rotationX: targetRotation1,
      duration: 10,
      ease: "power3.out",
      onComplete: () => {
        setIsSpinning(false);
      },
    });

    gsap.to("#ring2", {
      rotationX: targetRotation2,
      duration: 12, // Tăng thời gian để chính xác hơn
      ease: "power3.out",
    });

    gsap.to("#ring3", {
      rotationX: targetRotation3,
      duration: 14, // Tăng thời gian để chính xác hơn
      ease: "power3.out",
      onComplete: () => {
        $(".ring .item").removeClass("active");
        const items = document.querySelectorAll(".item");
        items.forEach((item) => {
          const rotation = gsap.getProperty(item, "rotationX");
          if (rotation % 360 === 0) {
            item.classList.add("active");
          }
        });
        if (selectedPrize) {
          setTempResult({
            prize: selectedPrize,
            number: randomResult.formattedNumber,
          });
          setShowConfirmPopup(true);
        }
      },
    });

    return randomResult;
  };

  const stopSpinning = () => {
    setIsSpinning(false);
    gsap.killTweensOf([".ring"]);
    if (!currentNumber) {
      return;
    }
    // Lấy số mục tiêu từ state hoặc tạo mới nếu cần
    const randomResult = currentNumber;

    // Thêm vòng quay phụ (2-3 vòng)
    const extraRotation = 720; // Cố định 2 vòng để đảm bảo chính xác

    // Tính góc quay cho từng số
    // Số 0 ở góc 0°, số 1 ở góc 36°, số 2 ở góc 72°, ...
    const angle1 = randomResult.firstDigit * 36;
    const angle2 = randomResult.secondDigit * 36;
    const angle3 = randomResult.thirdDigit * 36;

    // Tính góc quay cuối cùng (thêm 4° để điều chỉnh độ lệch)
    const targetRotation1 = extraRotation + angle1 + 4;
    const targetRotation2 = extraRotation + angle2 + 4;
    const targetRotation3 = extraRotation + angle3 + 4;

    // Animation dừng từ từ
    gsap.to("#ring1", {
      rotationX: targetRotation1,
      duration: 2,
      ease: "power3.out",
    });

    gsap.to("#ring2", {
      rotationX: targetRotation2,
      duration: 4, // Tăng thời gian để chính xác hơn
      ease: "power3.out",
    });

    gsap.to("#ring3", {
      rotationX: targetRotation3,
      duration: 6,
      ease: "power3.out",
      onComplete: () => {
        $(".ring .item").removeClass("active");
        const items = document.querySelectorAll(".item");
        items.forEach((item) => {
          const rotation = gsap.getProperty(item, "rotationX");
          if (rotation % 360 === 0) {
            item.classList.add("active");
          }
        });

        // Thay vì lưu ngay, hiển thị popup xác nhận
        if (selectedPrize) {
          setTempResult({
            prize: selectedPrize,
            number: randomResult.formattedNumber,
          });
          setShowConfirmPopup(true);
        }
      },
    });
  };
  const resetWheel = () => {
    setNotStarted(true);
    setIsSpinning(false);

    // Reset góc quay về ban đầu
    gsap.to("#ring1", {
      rotationX: -90,
      duration: 0,
    });
    gsap.to("#ring2", {
      rotationX: -90,
      duration: 0,
    });
    gsap.to("#ring3", {
      rotationX: -90,
      duration: 0,
    });

    // Reset active items
    $(".ring .item").removeClass("active");
  };
  // Hàm xử lý khi người dùng xác nhận lưu kết quả
  const handleConfirm = () => {
    if (tempResult) {
      try {
        const existingResults = JSON.parse(
          localStorage.getItem("lotteryResults") || "{}"
        );

        existingResults[tempResult.prize] = {
          number: tempResult.number,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem("lotteryResults", JSON.stringify(existingResults));
        setPrizes(existingResults);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
    resetWheel();
    setShowConfirmPopup(false);
    setTempResult(null);
    setSelectedPrize(null);
    setCurrentNumber(null);
  };

  // Hàm xử lý khi người dùng không lưu kết quả
  const handleCancel = () => {
    setShowConfirmPopup(false);
    setTempResult(null);
    setSelectedPrize(null);
    setCurrentNumber(null);
  };
  const PrizeButton = ({
    prizeKey,
    title,
    prizes,
    selectedPrize,
    setSelectedPrize,
  }) => {
    return (
      <button
        className={clsx(
          "prize transition-all ease-in-out duration-300 hover:scale-110",
          {
            "scale-105 border-[#dd160d]": prizes?.[prizeKey]?.number,
          },
          {
            "scale-105 border-[#eefa46]": selectedPrize === prizeKey,
          }
        )}
        onClick={() => setSelectedPrize(prizeKey)}
        disabled={prizes?.[prizeKey]?.number}
      >
        {prizes?.[prizeKey]?.number ? (
          <div className="text-white">
            <span>{title}: </span>
            {prizes?.[prizeKey]?.number}
          </div>
        ) : (
          <div>{title}</div>
        )}
      </button>
    );
  };
  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px]"
      style={{ backgroundImage: `url('/images/bg-lucky.jpg')` }}
    >
      <div className="container mx-auto">
        <div className="flex justify-center ">
          <div className="flex flex-col justify-end items-center gap-4">
            <PrizeButton
              prizeKey="dacbiet"
              title="Đặc biệt"
              prizes={prizes}
              selectedPrize={selectedPrize}
              setSelectedPrize={setSelectedPrize}
            />
            <PrizeButton
              prizeKey="giainhat"
              title="Giải nhất"
              prizes={prizes}
              selectedPrize={selectedPrize}
              setSelectedPrize={setSelectedPrize}
            />
            <div className="flex gap-4">
              <PrizeButton
                prizeKey="giainhi1"
                title="Giải nhì 1"
                prizes={prizes}
                selectedPrize={selectedPrize}
                setSelectedPrize={setSelectedPrize}
              />
              <PrizeButton
                prizeKey="giainhi2"
                title="Giải nhì 2"
                prizes={prizes}
                selectedPrize={selectedPrize}
                setSelectedPrize={setSelectedPrize}
              />
            </div>
            <div className="flex gap-4">
              <PrizeButton
                prizeKey="giaba1"
                title="Giải ba 1"
                prizes={prizes}
                selectedPrize={selectedPrize}
                setSelectedPrize={setSelectedPrize}
              />
              <PrizeButton
                prizeKey="giaba2"
                title="Giải ba 2"
                prizes={prizes}
                selectedPrize={selectedPrize}
                setSelectedPrize={setSelectedPrize}
              />
              <PrizeButton
                prizeKey="giaba3"
                title="Giải ba 3"
                prizes={prizes}
                selectedPrize={selectedPrize}
                setSelectedPrize={setSelectedPrize}
              />
            </div>
          </div>
          <div className="flex justify-center flex-1">
            <div className={`stage ${notStarted ? "notstarted" : ""}`}>
              <div className="grid grid-cols-3 gap-4">
                <div
                  key={1}
                  id={`col1`}
                  className="col third wheel border-[4px] "
                >
                  <div className="container-lucky">
                    <ul id={`ring1`} className={`ring  ? "held" : ""}`}>
                      {["0", "1", "0", "1", "0", "1", "0", "1", "0", "1"].map(
                        (emoji, i) => (
                          <li key={i} data-content={emoji} className="item">
                            <span>{emoji}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                {[2, 3].map((col) => (
                  <div
                    key={col}
                    id={`col${col}`}
                    className="col third wheel border-[4px] "
                  >
                    <div className="container-lucky">
                      <ul id={`ring${col}`} className={`ring  ? "held" : ""}`}>
                        {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                          (emoji, i) => (
                            <li key={i} data-content={emoji} className="item">
                              <span>{emoji}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 justify-center">
                <button
                  onClick={spinWheels}
                  disabled={isSpinning}
                  className={clsx(
                    "trigger text-2xl p-4 rounded-lg border-2 border-white text-white bg-[#dd160d]",
                    {
                      invisible: !selectedPrize,
                    }
                  )}
                >
                  Quay số
                </button>

                <button
                  onClick={stopSpinning}
                  className={clsx(
                    "trigger text-2xl p-4 rounded-lg border-2 border-white text-white bg-[#dd160d]",
                    {
                      invisible: !isSpinning,
                    }
                  )}
                  disabled={!isSpinning}
                >
                  Dừng lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm Popup Component */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-[#dd160d]">
              Xác nhận kết quả
            </h3>
            
            <div className="mb-4 text-xl font-bold text-[#dd160d]">
              <p className="text-xl mb-6">{TITLE_MAP[tempResult?.prize]}</p>
              <div className="text-[50px] font-[800] rounded-full border-[4px] border-[#dd160d] w-[160px] h-[160px] mx-auto ">
                <div className="flex justify-center items-center w-full h-full">{tempResult?.number}</div>
              </div>
            </div>

            <p className="mb-4">Bạn có muốn lưu kết quả này không?</p>
            <div className="flex justify-center gap-4 ">
              <button
                onClick={handleCancel}
                className="px-5 py-3 border-[#dd160d] border-2 text-[#dd160d] rounded-lg font-bold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-3 bg-[#dd160d] text-white rounded-lg font-bold"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
