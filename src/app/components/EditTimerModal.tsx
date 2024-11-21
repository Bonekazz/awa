"use client";

import { formatSeconds, toSeconds } from "@/lib/utils/formatting";
import { closeModal } from "@/lib/utils/modal";
import { createId } from "@paralleldrive/cuid2";
import { useEffect, useState } from "react";

interface Props {
  timers: any[], setTimers: any,
  selectedId: string, setSelectedId: any,
}

export default function EditTimerModal({ timers, setTimers, selectedId, setSelectedId }: Props) {
 
  const [data, setData] = useState({id: "", hours: 0, minutes: 0, seconds: 0, message: ""});

  useEffect(() => {
    if (!selectedId || !timers) return;

    const timer = timers.find((t: any) => t.id === selectedId);
    if (!timer) return;

    const time = formatSeconds(timer.time, false) as any;
    setData({id: timer.id, ...time, message: timer.message});
  }, [selectedId])

  useEffect(() => {
    console.log(data);
  }, [data]);

  function handleSubmit() {
    if (
      (Number(data.hours) + Number(data.minutes) + Number(data.seconds)) <= 0
      ) {
      closeModal("edit-timer-modal");
      throw new Error("invalid fields");
    }

    const newId = selectedId || createId();
    const time = toSeconds({hours: data.hours, minutes: data.minutes, seconds: data.seconds});
    const newData = {id: newId, time, message: data.message};
    
    if (selectedId) {
      const timersData = timers.filter((t:any) => t.id !== selectedId);
      localStorage.setItem("timers", JSON.stringify([...timersData, newData]));
      setTimers([...timersData, newData]);
      resetData();
      closeModal("edit-timer-modal");
      return;
    }

    localStorage.setItem("timers", JSON.stringify([...timers, newData]));
    setTimers([...timers, newData]);
    resetData();
    closeModal("edit-timer-modal");
  }

  function resetData() {
    setData({id: "", hours: 0, minutes: 0, seconds: 0, message: ""});
    setSelectedId("");
  }

  return (
    <dialog id="edit-timer-modal" className="modal">
      <div className="modal-box w-fit">

        <div className="flex flex-col gap-8 w-full justify-center items-center">
          <h1 className="text-xl">Editar</h1>
          <input 
            type="text" placeholder="mensagem ao finalizar" 
            className="bg-gray-300 px-5 py-2 rounded-lg"
            value={data.message || ""}
            onInput={(e: any) => {
              setData({...data, message: e.target.value});
            }}
          />
          <div className="flex gap-3">
            <input 
              type="number" min={0} 
              placeholder="hours" max={60}
              value={data.hours}
              onInput={(e: any) => {
                setData({...data, hours: Number(e.target.value)})
              }}
            />
            <input 
              type="number" placeholder="minutes" min={0} max={60} value={data.minutes}
              onInput={(e: any) => {
                if (e.target.value >= 60) {
                  setData({...data, hours: Number(data.hours) + 1, minutes: 0});
                  return;
                }
                setData({...data, minutes: Number(e.target.value)});
              }}
            />
            <input 
              type="number" min={0} placeholder="seconds" max={60} value={data.seconds}
              onInput={(e: any) => {
                if (e.target.value >= 60) {
                  if (data.minutes + 1 === 60) {
                    setData({...data, hours: Number(data.hours) + 1, minutes: 0, seconds: 0}); return;
                  }
                  setData({...data, minutes: Number(data.minutes) + 1, seconds: 0}); return;
                }
                setData({...data, seconds: Number(e.target.value)});
              }}
            />
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="butt cancel-btn" onClick={resetData}>cancelar</button>
          </form>
          <button className="butt action-btn" onClick={handleSubmit}>salvar</button>
        </div>
      </div>
    </dialog>
  )
}
