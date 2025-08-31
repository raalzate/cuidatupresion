import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/:userId((?!api|_next|static|favicon.ico).*)/settings",
    "/:userId((?!api|_next|static|favicon.ico).*)/history",
    "/:userId((?!api|_next|static|favicon.ico).*)",
  ], // Rutas protegidas
};
