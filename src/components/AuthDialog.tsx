import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chrome } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthDialog = ({ isOpen, onClose, onSuccess }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    if (loading) return;

    const emailValue = email.trim();
    const passwordValue = password.trim();

    if (!emailValue || !passwordValue) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ email và mật khẩu",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailValue,
          password: passwordValue,
        });

        if (error) throw error;

        toast({ title: "Đăng nhập thành công!" });
        onSuccess();
        onClose();
        setEmail("");
        setPassword("");
      } else {
        const { error } = await supabase.auth.signUp({
          email: emailValue,
          password: passwordValue,
        });

        if (error) throw error;

        toast({ title: "Đăng ký thành công! Bạn đã có thể đăng nhập." });
        onSuccess();
        onClose();
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng nhập với Google",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && email.trim() && password.trim()) {
      handleEmailAuth();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Đăng nhập để nhận gợi ý món ăn cá nhân hóa"
              : "Tạo tài khoản để lưu lịch sử và nhận gợi ý"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Đăng nhập với Google
          </Button>

          <div className="relative flex items-center py-2">
            <Separator className="flex-1" />
            <span className="px-3 text-xs uppercase text-muted-foreground bg-background">
              Hoặc
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleEmailAuth}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký"}
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
            }}
            disabled={loading}
          >
            {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

