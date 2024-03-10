import Head from "next/head";
import {Footer, Main, Navbar} from "@/components";
import {AuthSession, getAuthServerSideProps} from "@/utils/getAuthServerSideProps";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";
import {UserAPI} from "@/API";
import {Toaster} from "@/components/ui/sonner";
import Cookies from "universal-cookie";
import {toast} from "sonner";
import Router from "next/router";

type LoginPageProps = {
  session: AuthSession;
}

export default function LoginPage({session}: LoginPageProps) {
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!username || !password) {
        throw new Error('Preencha todos os campos');
      }

      const user = await UserAPI.signIn(username, password);
      if (!user) {
        throw new Error('Usuário ou senha incorretos');
      }

      const cookies = new Cookies(null, {
        path: '/',
      });

      cookies.set('x-panela-magica-auth', user.token);
      toast.success('Bem vindo de volta, ' + user.name);

      await Router.push('/')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Algo deu errado. Tente novamente');
      console.error(e);
    } finally {
      setLoading(false);
    }


  }
  return (
    <>
      <Head>
        <title>Login | Panela Mágica</title>
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar user={session.user}/>

        <Main className="flex-1 justify-center items-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>Digite suas credenciais para acessar a Panela Mágica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="space-y-2">
                  <Label htmlFor="username">Email ou usuário</Label>
                  <Input id="username" placeholder="Digite seu email ou usuário" required ref={usernameRef}/>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input id="password" required type="password" placeholder="Digite sua senha" ref={passwordRef}/>
                </div>
                <Button className="w-full" type='submit'>Login</Button>
              </form>
            </CardContent>
          </Card>
        </Main>
        <Footer/>
        <Toaster/>
      </div>
    </>
  )
}

export const getServerSideProps = getAuthServerSideProps(undefined, {allowUnauthenticated: true});
