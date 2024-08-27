import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Developed by{" "}
          <Link
            href="https://adistrim.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            adistrim
          </Link>
        </p>
      </div>
    </footer>
  );
}
