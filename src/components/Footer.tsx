import { Utensils, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
export function Footer() {return <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Utensils className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-display tracking-wider">CuisineCanvas</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The finest flavors, delivered to your door.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Menu</h3>
            <ul className="space-y-2">
              <li><a href="/#menu" className="text-sm text-muted-foreground hover:text-primary">Appetizers</a></li>
              <li><a href="/#menu" className="text-sm text-muted-foreground hover:text-primary">Main Courses</a></li>
              <li><a href="/#menu" className="text-sm text-muted-foreground hover:text-primary">Desserts</a></li>
              <li><a href="/#menu" className="text-sm text-muted-foreground hover:text-primary">Beverages</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CuisineCanvas. All rights reserved.
          </p>
          <div className="text-center text-xs text-muted-foreground/80">
            Built with ❤️ at Cloudflare
          </div>
        </div>
      </div>
    </footer>;}