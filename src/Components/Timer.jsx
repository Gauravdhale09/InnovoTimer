import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegClock } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import science from "../assets/images/science.svg";
import curve from "../assets/images/curve.png";
import backgroundVideo from "../assets/images/background3.mp4"; // Add your video here
import "../assets/css/timer.css";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("timerData"));
    if (savedData) {
      setTime(savedData.time);
      setTotalTime(savedData.totalTime);
      setIsRunning(savedData.isRunning);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem(
            "timerData",
            JSON.stringify({ time: newTime, totalTime, isRunning: true })
          );
          return newTime;
        });
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      setModal(true);
      localStorage.removeItem("timerData");
    }

    return () => clearInterval(timer);
  }, [time, isRunning, totalTime]);

  const startTimer = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setTotalTime(totalSeconds);
      setIsRunning(true);

      localStorage.setItem(
        "timerData",
        JSON.stringify({
          time: totalSeconds,
          totalTime: totalSeconds,
          isRunning: true,
        })
      );
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    localStorage.setItem(
      "timerData",
      JSON.stringify({ time, totalTime, isRunning: false })
    );
  };

  const resumeTimer = () => {
    setIsRunning(true);
    localStorage.setItem(
      "timerData",
      JSON.stringify({ time, totalTime, isRunning: true })
    );
  };

  const removeTimer = () => {
    setTime(0);
    setHours("");
    setMinutes("");
    setSeconds("");
    setIsRunning(false);
    setTotalTime(0);
    localStorage.removeItem("timerData");
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="video-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="container content mt-2">
        <header className="text-center text-white p-4 shadow-lg rounded .bd-dark">
          <p
            className="lead display-4 fw-bold text-4xl"
            style={{ fontFamily: "Cinzel Decorative" }}
          >
            # साक्षर <span style={{ color: "#FF9933" }}>BH</span>
            <span style={{ color: "#FFFFFF" }}>A</span>
            <span style={{ color: "#138808 " }}>RAT</span>
          </p>
          <h1
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "bolder",
            }}
          >
            Innovo 2025
          </h1>
          <img src={curve} alt="curve" width={400} height={20} />
          <h2 className="lead display-4 fw-bold text-4xl">Hackathon</h2>
        </header>
        <div className="home-theme container text-center mt-1">
          <div className="card p-5 shadow-lg mt-3 bg-dark text-white .bg-dark">
            <h2>
              Time Left:{" "}
              <span className="text-warning">{formatTime(time)}</span>
            </h2>
            {!isRunning && time === 0 && (
              <div>
                <div className="row g-2">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control text-center"
                      placeholder="HH"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control text-center"
                      placeholder="MM"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control text-center"
                      placeholder="SS"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary mt-3 px-5"
                  onClick={startTimer}
                >
                  Start Timer
                </button>
              </div>
            )}
            {isRunning && (
              <>
                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(time / totalTime) * 100}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <FlipClockCountdown
                    to={Date.now() + time * 1000} // Syncs with state
                    labels={["HOURS", "MINUTES", "SECONDS"]}
                    className="flip-clock"
                  />
                </div>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button className="btn btn-danger px-5" onClick={stopTimer}>
                    Stop
                  </button>
                  <button
                    className="btn btn-secondary px-5"
                    onClick={removeTimer}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
            {!isRunning && time > 0 && (
              <>
                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(time / totalTime) * 100}%` }}
                  ></div>
                </div>
                {/* <div className="d-flex justify-content-center mt-4">
                  <FlipClockCountdown
                    to={Date.now() + time * 1000}
                    labels={["HOURS", "MINUTES", "SECONDS"]}
                    className="flip-clock"
                  />
                </div> */}
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    className="btn btn-success px-5 py-2"
                    onClick={resumeTimer}
                  >
                    Resume
                  </button>
                  <button
                    className="btn btn-secondary px-5"
                    onClick={removeTimer}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {modal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0, 0, 0, 0.6)",
          }}
          id="gestureModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="gestureModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="dialog">
            <div
              className="modal-content"
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <div
                className="modal-header m-100"
                style={{
                  background: "#0d6efd",
                  color: "white",
                  justifyContent: "center",
                }}
              >
                <h5 className="modal-title" id="gestureModalLabel">
                  🎉 Mission Accomplished! 🚀
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setModal(false)}
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  <RiCloseCircleFill className="cross fa-10x" />
                </button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={science}
                  alt="Achievement"
                  style={{ width: "80px", marginBottom: "15px" }}
                />
                <h4>Congratulations, Innovator! 🏆</h4>
                <p>
                  You've successfully completed your task. Your dedication and
                  analytical thinking have brought you to the finish line. Keep
                  pushing boundaries! 🚀
                </p>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                  onClick={() => setModal(false)}
                  style={{ fontWeight: "bold" }}
                >
                  Thank You 🔬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

// background voice
