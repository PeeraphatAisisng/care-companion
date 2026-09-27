import Link from "next/link";

export function EmptyState({
  title,
  hint,
  href,
  action,
}: {
  title: string;
  hint: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="card px-6 py-12 text-center">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted">{hint}</p>
      {href && action ? (
        <Link href={href} className="btn btn-primary mt-5">
          {action}
        </Link>
      ) : null}
    </div>
  );
}
