import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import $ from "jquery";

const SlotMachine = () => {
  const [textContent, setTextContent] = useState("How will you do?");

  const [notStarted, setNotStarted] = useState(true);

  const [isSpinning, setIsSpinning] = useState(false);

  const [timer, setTimer] = useState(20);

  const timerRef = useRef(null);

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

  const startTimer = () => {
    setTimer(20);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsSpinning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const spinWheels = () => {
    setTextContent("Round and round it goes...");
    setNotStarted(false);
    setIsSpinning(true);
    $(".ring .item").removeClass("active");
    startTimer();

    const animate = () => {
      const minRotation = 5400;
      const maxRotation = 8640;

      const random1 = gsap.utils.random(minRotation, maxRotation, 36);
      const random2 = gsap.utils.random(minRotation, maxRotation, 36);
      const random3 = gsap.utils.random(minRotation, maxRotation, 36);

      const scrollCells = gsap.timeline({
        onComplete: () => {
          if (isSpinning) {
            requestAnimationFrame(animate);
          }
        },
      });

      scrollCells
        .to(
          "#ring1",
          {
            rotationX: `+=${random1}`,
            duration: 20,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          "#ring2",
          {
            rotationX: `+=${random2}`,
            duration: 20,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          "#ring3",
          {
            rotationX: `+=${random3}`,
            duration: 20,
            ease: "power2.inOut",
          },
          "<"
        )
        .play();
    };

    animate();
  };

  // Hàm tạo số ngẫu nhiên từ 1-180
  const generateRandomNumber = () => {
    // Random từ 1 đến 180
    const randomNum = Math.floor(Math.random() * 180) + 1;
    
    // Format số để luôn có 3 chữ số (thêm số 0 vào trước nếu cần)
    const formattedNumber = randomNum.toString().padStart(3, '0');
    
    // Tách thành từng chữ số
    const result = {
      fullNumber: randomNum,
      formattedNumber,
      firstDigit: parseInt(formattedNumber[0]),
      secondDigit: parseInt(formattedNumber[1]),
      thirdDigit: parseInt(formattedNumber[2])
    };

    console.log('Số ngẫu nhiên được tạo:', result);
    return result;
  };

  const stopSpinning = () => {
    setIsSpinning(false);
    gsap.killTweensOf([".ring"]);
    
    // Lấy số mục tiêu
    const randomResult = generateRandomNumber();
   

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
      ease: "power3.out"
    });
    
    gsap.to("#ring2", {
      rotationX: targetRotation2,
      duration: 4,  // Tăng thời gian để chính xác hơn
      ease: "power3.out"
    });
    
    gsap.to("#ring3", {
      rotationX: targetRotation3,
      duration: 6,  // Tăng thời gian để chính xác hơn
      ease: "power3.out",
      onComplete: () => {
        $(".ring .item").removeClass("active");
        const items = document.querySelectorAll(".item");
        items.forEach(item => {
          const rotation = gsap.getProperty(item, "rotationX");
          if (rotation % 360 === 0) {
            item.classList.add("active");
          }
        });

        
        setTextContent(`Số trúng thưởng: ${randomResult.formattedNumber}`);
      }
    });
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
      <div className="container">
        <div className="flex justify-center">
          <div className={`stage ${notStarted ? "notstarted" : ""}`}>
            <div className="grid grid-cols-3 gap-4">
              <div key={1} id={`col1`} className="col third wheel border-[4px] ">
                <div className="container ">
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
                  <div className="container ">
                    <ul id={`ring${col}`} className={`ring  ? "held" : ""}`}>
                      {["0" ,"1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
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
  );
};

export default SlotMachine;
