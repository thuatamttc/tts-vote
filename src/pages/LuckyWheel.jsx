import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import $ from "jquery";
import "./../style/lotteryWheel.css";
const SlotMachine = () => {
  const [textContent, setTextContent] = useState("How will you do?");

  const [notStarted, setNotStarted] = useState(true);

  const [isSpinning, setIsSpinning] = useState(false);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [tempResult, setTempResult] = useState(null);
  
  const [ selectedPrize, setSelectedPrize ] = useState(null);


  const timerRef = useRef(null);

  const [currentNumber, setCurrentNumber] = useState(null);
  
  useEffect(() => {
    const items = gsap.utils.toArray(".item");

    const finishScroll = () => {
      items.forEach((item) => {
        gsap.to(item, {
          onComplete: () => {
            const activeItem1 =
              document.querySelector("#col1 .item.active")?.dataset.content;
            const activeItem2 =
              document.querySelector("#col2 .item.active")?.dataset.content;
            const activeItem3 =
              document.querySelector("#col3 .item.active")?.dataset.content;

            if (!notStarted) {
              if (activeItem1 === activeItem2 && activeItem2 === activeItem3) {
                setTextContent(
                  `You won, woohoo! Everyone gets ${activeItem1}s!`
                );
              } else if (
                activeItem1 !== activeItem2 &&
                activeItem2 !== activeItem3 &&
                activeItem1 !== activeItem3
              ) {
                setTextContent("Bad luck, you lost");
              } else {
                setTextContent(
                  `Close but no ${
                    activeItem1 || activeItem2 || activeItem3
                  }s for you. Why not try again?`
                );
              }
            }
          },
        });
      });
    };

    const timeline = gsap.timeline({ onComplete: finishScroll });

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
    // Random từ 1 đến 180
    const randomNum = Math.floor(Math.random() * 180) + 1;

    // Format số để luôn có 3 chữ số (thêm số 0 vào trước nếu cần)
    const formattedNumber = randomNum.toString().padStart(3, "0");

    // Tách thành từng chữ số
    const result = {
      fullNumber: randomNum,
      formattedNumber,
      firstDigit: parseInt(formattedNumber[0]),
      secondDigit: parseInt(formattedNumber[1]),
      thirdDigit: parseInt(formattedNumber[2]),
    };

    console.log("Số ngẫu nhiên được tạo:", result);
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

        setTextContent(`Số trúng thưởng: ${randomResult.formattedNumber}`);
      },
    });
   
    return randomResult;
  };
  
  const stopSpinning = () => {
    setIsSpinning(false);
    gsap.killTweensOf([".ring"]);
    if(!currentNumber){
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

        setTextContent(`Số trúng thưởng: ${randomResult.formattedNumber}`);

        // Thay vì lưu ngay, hiển thị popup xác nhận
        if (selectedPrize) {
          setTempResult({
            prize: selectedPrize,
            number: randomResult.formattedNumber
          });
          setShowConfirmPopup(true);
        }
      },
    });
  };

  // Hàm xử lý khi người dùng xác nhận lưu kết quả
  const handleConfirm = () => {
    if (tempResult) {
      const existingResults = JSON.parse(localStorage.getItem('lotteryResults') || '{}');
      existingResults[tempResult.prize] = {
        number: tempResult.number,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lotteryResults', JSON.stringify(existingResults));
    }
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

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px]"
      style={{ backgroundImage: `url('/images/bg-lucky.jpg')` }}
    >
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center">
            <div className="" onClick={() => setSelectedPrize('dacbiet')}>Đặc biệt</div>
            <div className="">Giải nhất</div>

            <div className="flex gap-4">
              <div>giải nhì 1</div>
              <div>giải nhì 2</div>
            </div>
            <div className="flex gap-4">
              <div>giải ba 1</div>
              <div>giải ba 2</div>
              <div>giải ba 2</div>
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
                  className="trigger text-2xl p-4 rounded-lg border-2 border-white text-white bg-[#dd160d]"
                >
                  Quay số
                </button>

                <button
                  onClick={stopSpinning}
                  className="trigger text-2xl p-4 rounded-lg border-2 border-white text-white bg-[#dd160d]"
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
            <h3 className="text-xl font-bold mb-4">Xác nhận kết quả</h3>
            <p className="mb-4">
              Bạn có muốn lưu kết quả này không?
            </p>
            <div className="mb-4">
              <p>Giải: {tempResult?.prize}</p>
              <p>Số trúng: {tempResult?.number}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
