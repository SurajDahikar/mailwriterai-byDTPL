import { signInWithGoogle, logout } from "../utils/auth";

export default function AuthButton({ user }) {
  return (
    <div>
      {user ? (
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
      ) : (
        <button onClick={signInWithGoogle} className="px-4 py-2 bg-blue-500 text-white rounded">
          Sign In with Google
        </button>
      )}
    </div>
  );
}
