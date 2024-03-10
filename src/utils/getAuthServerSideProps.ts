import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import {User, UserAPI} from "@/API";

type GetAuthServerSidePropsOptions = {
  redirectTo?: string;
  allowUnauthenticated?: boolean;
}

export type AuthSession = {
  user: User | null;
  token: string | null;
}

type GetServerSidePropsWrappedFunction<T> = (context: GetServerSidePropsContext, session: AuthSession) => GetServerSidePropsResult<T> | Promise<GetServerSidePropsResult<T>>;
export const getAuthServerSideProps = <T extends { [key: string]: any } = {
  [key: string]: any
}>(handler?: GetServerSidePropsWrappedFunction<T>, options?: GetAuthServerSidePropsOptions) => {
  const {redirectTo = '/login', allowUnauthenticated = false} = options || {};

  return async (context: GetServerSidePropsContext) => {
    const {req, res} = context;
    const authCookie = req.cookies['x-panela-magica-auth'];

    if (!authCookie && !allowUnauthenticated) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }

    const user = await UserAPI.me(authCookie || '');
    if (!user && !allowUnauthenticated) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }

    const session = {
      user: user || null,
      token: authCookie || null,
    };

    if (handler) {
      return handler(context, session);
    }

    return {
      props: {
        session,
      },
    };
  };
};
