"use client";

import { useEffect, useRef, useState } from "react"
import Timer from "./Timer";
import { openModal } from "@/lib/utils/modal";
import EditTimerModal from "./EditTimerModal";
import EnableSound from "./EnableSound";
import Link from "next/link";
import { Heart } from "lucide-react";
import EnableSoundModal from "./EnableSoundModal";

export default function TimersManager() {
  const [timers, setTimers] = useState<any | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem("timers");
    if (!localData) {setTimers([]); return;}
    setTimers(JSON.parse(localData));
    audioRef.current && audioRef.current.load();
  }, []);

  useEffect(() => {
    if (soundEnabled !== null) return;

    const isSoundEnabled = localStorage.getItem("isSoundEnabled") || null;
    if (!isSoundEnabled) {
      localStorage.setItem("isSoundEnabled", "false");
      setSoundEnabled(false);
      return;
    }
    console.log(JSON.parse(isSoundEnabled));
    setSoundEnabled(JSON.parse(isSoundEnabled));

  }, [soundEnabled]);

  function handleSound() {
    if (audioRef.current) {
      audioRef.current.load(); // Preload the audio file
    }
    console.log("handling sound: ", !soundEnabled);
    localStorage.setItem("isSoundEnabled", `${!soundEnabled}`);
    setSoundEnabled(!soundEnabled); 
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <audio ref={audioRef} src="/alarm.wav" loop={true} preload="auto" className="hidden"></audio>
      <div className="flex flex-col gap-5">
        <div className="flex gap-8">
          <button className="butt cancel-btn w-fit" onClick={() => {openModal("edit-timer-modal")}}>adicionar novo</button>
          { (soundEnabled !== null) &&  <EnableSound isEnabled={soundEnabled} handleSound={handleSound}/>}
        </div>
        <ul className={
          `flex flex-col gap-3 justify-center items-center 
          md:flex-row md:flex-wrap md:justify-normal md:items-start
          pb-8
        `}>
          { (soundEnabled !== null) && timers && timers.map((timer: any, index: number) => {
            return (
              <li key={index} className="w-full md:w-fit border rounded-xl p-5">
                <Timer 
                  alarm={audioRef} soundEnabled={soundEnabled}
                  timerData={JSON.parse(JSON.stringify(timer))} 
                  setSelectedTimer={setSelectedTimer}
                  setTimers={setTimers} timers={timers}
                />
              </li>
            )
          })}
        </ul>
      </div>

      <EditTimerModal timers={timers} setTimers={setTimers} selectedId={selectedTimer} setSelectedId={setSelectedTimer}/>
      <EnableSoundModal />

      <div className="flex gap-1 items-center w-full justify-center py-8">
        <span>developed with</span>
        <Heart size={18}/>
        <span>by</span>
        <Link className="underline" href="https://linktr.ee/bonekazz" target="_blank">Hierro Fernandes</Link>
      </div>
    </div>
  )
}
