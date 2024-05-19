import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  const response = NextResponse.next();

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.append(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
