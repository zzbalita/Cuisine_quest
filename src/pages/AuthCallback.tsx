import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles OAuth callbacks from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          toast({ title: "Đăng nhập thành công!" });
          navigate("/");
        } else {
          // If no session, try to get it from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              throw sessionError;
            }

            toast({ title: "Đăng nhập thành công!" });
            navigate("/");
          } else {
            // Wait a bit for Supabase to process the callback
            setTimeout(async () => {
              const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
              if (retrySession) {
                toast({ title: "Đăng nhập thành công!" });
                navigate("/");
              } else if (retryError) {
                throw retryError;
              } else {
                throw new Error("Không thể xác thực. Vui lòng thử lại.");
              }
            }, 1000);
          }
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast({
          title: "Lỗi đăng nhập",
          description: error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

