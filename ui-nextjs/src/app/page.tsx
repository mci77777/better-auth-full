"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE}/api/auth/session`, {
          credentials: "include",
        });
        if (response.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        // 未登录，保持在首页
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Better Auth Demo
          </h1>
          <p className="text-gray-600 mb-8">
            一个完整的身份验证系统演示，支持邮箱密码登录、邮箱OTP验证和JWT令牌。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登录
          </Link>
          
          <Link
            href="/register"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            注册新账户
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>技术栈：</p>
          <p>Better Auth + Next.js + FastAPI + PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}

