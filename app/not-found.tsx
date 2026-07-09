import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/lib/guides";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Siden finnes ikke
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Lenken kan være feilstavet eller utdatert. Kalkulatoren og guidene
        finner du her:
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Til utleiekalkulatoren</Link>
      </Button>
      <div className="mt-10 text-left">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Populære guider
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {GUIDES.slice(0, 4).map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guide/${guide.slug}`}
                className="text-primary hover:underline"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
