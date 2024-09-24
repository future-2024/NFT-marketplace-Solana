//src/app/page.tsx
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">
        Welcome to My Fashion App
      </h1>
      <div className="space-x-4">
        <Link
          href="/register"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
