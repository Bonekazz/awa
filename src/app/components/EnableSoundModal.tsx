import { openModal } from "@/lib/utils/modal";
import { Volume2 } from "lucide-react";
import { useEffect } from "react";

export default function EnableSoundModal() {

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenSoundAlert");
    if (hasSeenModal) return;
    openModal("sound-modal");
  }, [])
  
  function handleSubmit() {
    localStorage.setItem("hasSeenSoundAlert", "true");
  }
  return (
    <dialog id="sound-modal" className="modal">
      <div className="modal-box flex flex-col gap-5 text-justify">
        <span className="text-xl">Ative o alarme pressionando o ícone <Volume2 className="inline"/> para ser notificado quando os temporizadores terminarem.</span>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="butt action-btn" onClick={handleSubmit}>Beleza</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
