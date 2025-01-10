import { useEffect, useRef, useState } from "react";

const sectors = [
  { color: "#E5243B", label: "Nhân viên 1" },
  { color: "#DDA63A", label: "Nhân viên 2" },
  { color: "#C5192D", label: "Nhân viên 3" },
  { color: "#FF3A21", label: "Nhân viên 4" },
  { color: "#FCC30B", label: "Nhân viên 5" },
  { color: "#DD1367", label: "Nhân viên 6" },
  { color: "#FD9D24", label: "Nhân viên 7" },
  { color: "#BF8B2E", label: "Nhân viên 8" },
  { color: "#3F7E44", label: "Nhân viên 9" },
  { color: "#0A97D9", label: "Nhân viên 10" },
];

const LuckyWheel = () => {
  const canvasRef = useRef(null);
  const spinButtonRef = useRef(null);

  const [winner, setWinner] = useState("");

  const wheelRef = useRef({
    angVel: 0, // Angular velocity
    ang: 0, // Angle in radians
    friction: 0.991, // 0.995=soft, 0.99=mid, 0.98=hard
  });

  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = sectors.length;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;

  const showResult = (winner) => {
    setWinner(winner);

  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dia = ctx.canvas.width;
    const rad = dia / 2;

    const getIndex = () =>
      Math.floor(tot - (wheelRef.current.ang / TAU) * tot) % tot;

    const drawSector = (sector, i) => {
      const ang = arc * i;
      ctx.save();
      // COLOR
      ctx.beginPath();
      ctx.fillStyle = sector.color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();
      // TEXT
      ctx.translate(rad, rad);
      ctx.rotate(ang + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(sector.label, rad - 10, 10);
      ctx.restore();
    };

    const rotate = () => {
      const sector = sectors[getIndex()];
      canvas.style.transform = `rotate(${wheelRef.current.ang - PI / 2}rad)`;
      if (spinButtonRef.current) {
        spinButtonRef.current.textContent = !wheelRef.current.angVel
          ? "SPIN"
          : sector.label;
        spinButtonRef.current.style.background = sector.color;
      }
    };

    const frame = () => {
      if (!wheelRef.current.angVel) {
        if (wheelRef.current.isSpinning) {
          console.log(
            "wheelRef.current.isSpinning",
            wheelRef.current.isSpinning
          );
          // Khi vừa dừng quay, hiển thị kết quả
          const winner = sectors[getIndex()].label;
          showResult(winner);
          wheelRef.current.isSpinning = false;
        }
        return;
      }
      wheelRef.current.angVel *= wheelRef.current.friction;
      if (wheelRef.current.angVel < 0.002) wheelRef.current.angVel = 0;
      wheelRef.current.ang += wheelRef.current.angVel;
      wheelRef.current.ang %= TAU;
      rotate();
    };

    const engine = () => {
      frame();
      requestAnimationFrame(engine);
    };

    // Initialize
    sectors.forEach(drawSector);
    rotate();
    engine();
  }, []);

  const handleSpin = () => {
    if (!wheelRef.current.angVel) {
      wheelRef.current.angVel = rand(0.25, 0.45);
      wheelRef.current.isSpinning = true;
    }
  };

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full"
      style={{ backgroundImage: `url('/images/bglucky.png')` }}
    >
      <div className="py-[40px] container mx-auto">
        <div className="flex justify-center items-center">
          <img src={"/images/logo.svg"} alt="logo" className="w-[70px]" />
        </div>
        <h1 className="text-2xl lg:text-4xl font-bold mt-2 text-center">
          TOÀN THỊNH
        </h1>
        <div className="flex justify-between mt-10">
          <div id="wheelOfFortune" className="">
            <canvas
              ref={canvasRef}
              id="wheel"
              width="600"
              height="600"
            ></canvas>
            <button onClick={handleSpin} ref={spinButtonRef} id="spin">
              Rotar
            </button>
          </div>
          {winner && (
            <div className="flex flex-col align-items-start justify-center flex-1">
              <h2 className="text-3xl font-bold">🎉 Chúc mừng!</h2>
              <div className="mt-10">
              <h3 className="text-blue-600 font-bold text-2xl">
                {winner}
              </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;
