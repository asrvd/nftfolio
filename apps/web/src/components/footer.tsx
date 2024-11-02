import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border text-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          <p>
            Made by{" "}
            <Link
              href="https://github.com/asrvd"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Ashish
            </Link>
          </p>
        </div>
        <div className="text-sm">
            <Link
              href="https://github.com/asrvd/nftfolio"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Source
            </Link>
        </div>
      </div>
    </footer>
  );
}
