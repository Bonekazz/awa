"use client";

import { formatSeconds } from "@/lib/utils/formatting";
import { closeModal, openModal } from "@/lib/utils/modal";
import { CirclePause, CirclePlay, Pencil, Repeat1, RotateCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react"

interface Props { 
  alarm: MutableRefObject<HTMLAudioElement | null>, soundEnabled: boolean,
  timerData: any,
  setSelectedTimer: any, setTimers: any, timers: any[]
}
export default function Timer({ alarm, soundEnabled, timerData, setSelectedTimer, setTimers, timers }: Props) {

  const [timer, setTimer] = useState<any | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    if (!timerData) return;
    setTimer(timerData);
  }, [timerData]);
  
  useEffect(() => {
    if (!timer) return;
    let interval: NodeJS.Timeout;

    if (timer.time === 0 && isActive) {
      setIsActive(false);
      setHasFinished(true);
      openModal(`${timer.id}-reset-modal`);
      if (alarm.current && soundEnabled) {
        alarm.current.play(); 
      }
    };

    if (isActive && timer.time > 0) {
      interval = setInterval(() => {
        setTimer({...timer, time: timer.time - 1});
      }, 1000);
    }
    return () => clearInterval(interval);

  }, [isActive, timer])

  function resetTimer() {
    setTimer(timerData);
    loop ? setIsActive(true) : setIsActive(false);
    if (alarm.current) {
      alarm.current.pause();
      alarm.current.currentTime = 0;
    }
    closeModal(`${timer.id}-reset-modal`);
  }

  function handleDelete() {
    const newTimers = timers.filter((t: any) => t.id !== timer.id);
    localStorage.setItem("timers", JSON.stringify(newTimers));
    setTimers(newTimers);
  }

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      
      <div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              {timer && timer.message && <span>{timer.message}</span>}
              {timer && 
                <div className={`${isActive && "opacity-15 cursor-not-allowed"} flex`}>
                  <button
                    className={`animated-button active:bg-gray-300 rounded-xl p-2`}
                    onClick={handleDelete}
                    disabled={isActive}
                  >
                    <Trash2 />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTimer(timer.id);
                      openModal("edit-timer-modal");
                    }}
                    disabled={isActive}
                    className={`animated-button active:bg-gray-300 rounded-xl p-2`}>
                      <Pencil />
                  </button>
                </div>
              }
            </div>
            <span className="text-[5em]">{timer && formatSeconds(timer.time, true)}</span>
          </div>

          <div className="flex gap-3">
            <button 
              className={`rounded-full animated-button bg-black p-2 ${isActive && !isPaused && "opacity-15 cursor-not-allowed"}`} 
              disabled={isActive && !isPaused}
              onClick={() => {
                setIsActive(true); setHasFinished(false); setIsPaused(false);
              }}
            ><CirclePlay size={22} color="white"/></button>

            <button 
              className={`rounded-full animated-button bg-gray-300 p-2 ${(!isActive || isPaused) && "opacity-15 cursor-not-allowed"}`}
              disabled={!isActive || isPaused}
              onClick={() => {
                setIsPaused(true); setIsActive(false);
              }}
            ><CirclePause size={22} color="black"/></button>

            <button 
              className={`rounded-full animated-button bg-gray-300 p-2 ${isActive && "opacity-15 cursor-not-allowed"}`}
              disabled={isActive}
              onClick={() => {
                setTimer(timerData);
              }}
            ><RotateCcw size={20} color="black"/></button>

            <button 
              className={`rounded-full border ${loop && "border-black border-2"} animated-button bg-white p-2`}
            onClick={() => {
              if (!alarm.current) return;
              alarm.current.loop = !loop;
              setLoop(!loop);
            }}
            ><Repeat1 className={`${!loop && "opacity-50"}`} size={22} color="black"/></button>

          </div>
        </div>
      </div>

      <dialog id={`${timer && timer.id}-reset-modal`} className="modal">
        <div className="modal-box flex flex-col gap-5">

          <div className="flex gap-5 w-full">
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden relative"><Image src="/icon-192x192.png" alt="" fill={true} style={{objectFit: "cover"}}/></div>
            <p className="text-3xl">{ timer && timer.message }</p>
          </div>

          <div className="flex justify-end w-full">
            <button className="butt action-btn" onClick={resetTimer}>beleza</button>
          </div>

        </div>
      </dialog>
    </div>
  )
}
