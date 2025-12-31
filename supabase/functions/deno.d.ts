declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

// Type declarations for Deno URL imports
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(
    url: string,
    key: string,
    options?: {
      global?: {
        headers?: Record<string, string>;
      };
    }
  ): any;
}

