import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h2>🔐 Iniciar sesión</h2>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
