import React, { useCallback, useEffect, useRef, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import clsx from "clsx";
import useEchoEvent from "../hooks/useEchoEvent";
import { getVoteCount } from "../services";

const ShowVote = () => {
  const [showCard, setShowCard] = useState(false);
  const ref = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const timeRef = useRef(30);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const countdownDisplayRef = useRef(null);
  const [canVote, setCanVote] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const { data: performance } = useEchoEvent(
    "performance-channel",
    "Performance"
  );
  const { data: scoringData } = useEchoEvent("scoring-channel", "StartScoring");
  const { data: voteData } = useEchoEvent("votes", "VoteCreated");

  const [localPerformance, setLocalPerformance] = useState(() => {
    try {
      const saved = localStorage.getItem("currentPerformance");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error parsing localStorage:", error);
      return null;
    }
  });

  // Lưu performance vào localStorage khi có data mới
  const savePerformance = useCallback((data) => {
    try {
      localStorage.setItem("currentPerformance", JSON.stringify(data));
      setLocalPerformance(data);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, []);

  const toggle = () => {
    if (!ref.current) return;
    if (ref.current.isRunning) {
      ref.current.stop();
    } else {
      ref.current.start();
    }
  };

  const lastFetchRef = useRef(0);
  const throttledFetchVoteCount = useCallback(async (performanceId) => {
    const now = Date.now();

    // Chỉ fetch nếu đã qua 1 giây kể từ lần fetch trước
    if (now - lastFetchRef.current >= 1500) {
      try {
        const data = await getVoteCount(performanceId);
        setVoteCount(Number(data?.vote_count));
        lastFetchRef.current = now;
      } catch (err) {
        console.error("Error fetching vote count:", err);
      }
    }
  }, []);

  useEffect(() => {
    setIsRunning(true);
    setShowCard(false);
    setCanVote(false);
    setVoteCount(0);
    toggle();
    const timer = setTimeout(() => {
      setIsRunning(false);
      toggle();
      setShowCard(true);
    }, 3000);
    if (performance) {
      savePerformance(performance);
    }
    return () => clearTimeout(timer);
  }, [performance]);

  useEffect(() => {
    if (scoringData) {
      setCanVote(true);
      startCountdown();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scoringData]);

  useEffect(() => {
    console.log(voteData);
    throttledFetchVoteCount(localPerformance?.id);
  }, [localPerformance?.id, voteData]);

  const startCountdown = () => {
    startTimeRef.current = Date.now();
    timeRef.current = 30;

    const updateDisplay = () => {
      if (countdownDisplayRef.current) {
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const remainingSeconds = Math.max(30 - elapsedSeconds, 0);
        timeRef.current = remainingSeconds;

        countdownDisplayRef.current.textContent = `${remainingSeconds}s`;

        if (remainingSeconds <= 0) {
          clearInterval(intervalRef.current);
          setCanVote(false);
        }
      }
    };

    intervalRef.current = setInterval(updateDisplay, 1000);
    updateDisplay(); // Chạy ngay lập tức
  };

  return (
    <div
      className="bg-cover bg-top min-h-[100vh] h-full py-[20px] lg:py-[40px]"
      style={{ backgroundImage: `url('/images/background.png')` }}
    >
      <div className="bg-black/20 absolute top-0 left-0 w-full h-full z-[1]"></div>
      <div className="container mx-auto relative z-[2]">
        <div className="bg-cover bg-center">
          <div className="flex justify-center items-center">
            <img src={"/images/logo.svg"} alt="logo" className="w-[70px]" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mt-2 text-white text-center">
            TOÀN THỊNH GOT TALENT 2025
          </h1>
          {showCard && localPerformance && (
            <div
              className={clsx(
                "mt-6 justify-center  items-center mx-4 transition-all duration-700 fade-in flex "
              )}
            >
              <div className="w-full max-w-sm bg-[rgb(35,34,34,0.4)] bg-opacity-40 rounded-lg p-6 shadow-lg">
                {canVote && (
                  <div className="text-white text-lg font-semibold">
                    Thời gian còn lại:{" "}
                    <span ref={countdownDisplayRef}>30s</span>
                  </div>
                )}
                <div className="flex flex-col items-center py-8">
                  <div className="text-white text-2xl font-bold mb-2">
                    {localPerformance?.title}
                  </div>
                  <img
                    className="w-[200px] lg:w-[350px] h-[200px] lg:h-[350px] mb-3 rounded-full shadow-lg object-cover"
                    src={
                      localPerformance?.image
                        ? `https://sukien.cmsfuture.online/storage/${localPerformance?.image}`
                        : "/images/avatar.png"
                    }
                    alt="Bonnie Green"
                  />
                  <div className="text-white text-xl font-bold">
                    {localPerformance?.performer}
                  </div>
                  <div className="mt-4 md:mt-6 w-full lg:px-4 px-2">
                    <div className="mt-2 text-white font-medium text-center text-3xl">
                      Lượt bình chọn: {voteCount ? voteCount : "0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRunning && (
            <Fireworks
              ref={ref}
              options={{
                speed: 0.2,
                decay: 0.015,
                acceleration: 1.02,
              }}
              style={{
                opacity: 0.5,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "fixed",
                background: "#000",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowVote;
