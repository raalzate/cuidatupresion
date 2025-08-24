import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirigir al login de Google
  },
});

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Rutas protegidas
};