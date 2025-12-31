import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X, Home, User, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { AuthDialog } from "./AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="Logo" className="h-10 w-10 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">HÔM NAY ĂN GÌ?</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink
              to="/"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Món Ăn Ngon
            </NavLink>
            <NavLink
              to="/recipes"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Công Thức Nấu
            </NavLink>
            <NavLink
              to="/locations"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Món Ngon Quanh Ta
            </NavLink>
            <NavLink
              to="/blog"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Blog
            </NavLink>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getUserInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">
                      {user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAuthDialog(true)}
              >
                <User className="mr-2 h-4 w-4" />
                Đăng Nhập
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Món Ăn Ngon
              </NavLink>
              <NavLink
                to="/recipes"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Công Thức Nấu
              </NavLink>
              <NavLink
                to="/locations"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Món Ngon Quanh Ta
              </NavLink>
              <NavLink
                to="/blog"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </NavLink>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getUserInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground/80">{user.email?.split("@")[0]}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng Xuất
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setShowAuthDialog(true);
                    setIsOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Đăng Nhập
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
        }}
      />
    </nav>
  );
};
