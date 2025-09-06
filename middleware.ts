import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/:userId((?!api|_next|static|favicon.ico|images|icons).*)/settings",
    "/:userId((?!api|_next|static|favicon.ico|images|icons).*)/history",
    "/:userId((?!api|_next|static|favicon.ico|images|icons).*)",
  ], // Rutas protegidas
};
