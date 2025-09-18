"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, callFastAPI } from "@/lib/auth-client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        // 获取用户信息
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE}/api/auth/session`, {
          credentials: "include",
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        }

        // 调用 FastAPI 接口
        const [chatResponse, profileResponse] = await Promise.all([
          callFastAPI("/agent/chat", token),
          callFastAPI("/agent/profile", token),
        ]);

        setChatData(chatResponse);
        setProfileData(profileResponse);
      } catch (err) {
        setError(`加载数据失败: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("jwt");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Better Auth Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 用户信息卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  用户信息
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>从 Better Auth 获取的用户会话信息</p>
                </div>
                <div className="mt-3">
                  {user && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FastAPI 聊天数据 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  FastAPI 聊天接口
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>从 FastAPI /agent/chat 获取的数据</p>
                </div>
                <div className="mt-3">
                  {chatData && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm">{JSON.stringify(chatData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FastAPI 用户资料数据 */}
            <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  FastAPI 用户资料接口
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>从 FastAPI /agent/profile 获取的数据</p>
                </div>
                <div className="mt-3">
                  {profileData && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm">{JSON.stringify(profileData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

