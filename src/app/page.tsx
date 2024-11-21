import TimersManager from "./components/TimersManager";

export default async function Page() {
  return (
    <div className="w-full h-full p-8 flex flex-col justify-center items-center">
      <TimersManager />
    </div>
  )
}

