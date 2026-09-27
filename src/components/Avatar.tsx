import { initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 48,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="grid place-items-center rounded-full bg-teal-soft font-bold text-teal"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials(name || "C")}
    </div>
  );
}
