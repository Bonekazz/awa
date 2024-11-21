export function formatSeconds(sec: number, toString: boolean) {
  let hours: any = Math.floor(sec / 3600);
  let minutes: any = Math.floor((sec % 3600) / 60);
  let seconds: any = (sec % 60);

  if (toString) {
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    return `${hours === "00" ? "" : `${hours} : ` }${minutes} : ${seconds}`;
  }

  return { hours, minutes, seconds };
  
}

interface Props {
  hours: number, minutes: number, seconds: number
}
export function toSeconds({hours, minutes, seconds}: Props) {
  return hours * 3600 + minutes * 60 + seconds;
}
