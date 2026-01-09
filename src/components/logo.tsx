import Image from "next/image"

export function Logo(): React.ReactElement {
  return (
    <Image
      src="/kizento.svg"
      alt="Kizento"
      width={200}
      height={48}
      priority
      className="h-12 w-auto"
    />
  )
}
