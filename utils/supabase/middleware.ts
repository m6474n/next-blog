import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            response.cookies.set(name, value);
          });
        },
      },
    },
  );

  try {
    // Refresh session to check if the user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirect non-authenticated users to the login page
    if (request.nextUrl.pathname === "/" && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from the login page
    if (request.nextUrl.pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (e) {
    console.error("Error during session update:", e);
    return response; // Return the unmodified response
  }
};
