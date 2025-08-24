import { useSession, signOut } from "next-auth/react";

export default function Home() {

   const { data: session } = useSession();

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>EduPrompt ✨</h1>
        <div style={styles.subtitle}>
          {!session ? (
            "No has iniciado sesión ") : (
            <>
              <span>Hola, {session.user.name} </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{ marginLeft: 8, cursor: "pointer" }}
              >
                (Cerrar sesión)
              </button>
            </>
          )}
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.col}>
         Opciones de menu
        </div>
        <div style={styles.col}>
         Contenido principal
        </div>
      </main>

      <footer style={styles.footer}>
        <small>
          Footer
        </small>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f3f4f6" },
  header: { padding: "1.25rem", textAlign: "center" },
  h1: { margin: 0, fontSize: 28 },
  subtitle: { color: "#6b7280", marginTop: 8 },
  main: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "1fr",
    padding: "1rem",
    maxWidth: 1100,
    margin: "0 auto",
  },
  col: { display: "grid", gap: 12 },
  footer: { textAlign: "center", padding: "1rem", color: "#6b7280" },
};
