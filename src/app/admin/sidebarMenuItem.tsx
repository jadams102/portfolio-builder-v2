import Link from "next/link";
import Image from "next/image";

export default function SidebarMenuItem({ label, alt, icon, url }: { label?: string, alt?: string, icon: string, url: string }) {
  return (
  <li>
    <Link
      href={ url }
      className="flex flex-row items-center gap-4 opacity-50 hover:opacity-100 active:opacity-100"
    >
      <Image src={ icon } alt={ alt ? alt : "" } width={16} height={16} />
      { label }
    </Link>
  </li>
  )
}