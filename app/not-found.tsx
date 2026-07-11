import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/lib/guides";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-20 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">
        Siden finnes ikke
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
        Lenken kan være feilstavet eller utdatert. Kalkulatoren og guidene
        finner du her:
      </p>
      <Button
        asChild
        size="lg"
        className="mt-7 h-11 rounded-full px-6 text-[15px] font-semibold"
      >
        <Link href="/">Til utleiekalkulatoren</Link>
      </Button>
      <div className="mt-14 text-left">
        <p className="eyebrow">Populære guider</p>
        <div className="mt-4 divide-y divide-border border-t border-border">
          {GUIDES.slice(0, 4).map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group flex items-center justify-between gap-6 py-4"
            >
              <span className="text-sm font-medium underline-offset-4 group-hover:underline">
                {guide.title}
              </span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
