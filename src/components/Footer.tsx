import { Utensils } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Utensils className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-display tracking-wider">CuisineCanvas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CuisineCanvas. All rights reserved.
          </p>

        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/80">
          Built with ❤️ at Cloudflare
        </div>
      </div>
    </footer>
  );
}