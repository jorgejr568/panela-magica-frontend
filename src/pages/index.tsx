import {Inter} from "next/font/google";
import {Footer, Main, Navbar} from "@/components";
import {Receita, ReceitasAPI} from "@/API/receita";
import {GetServerSidePropsResult} from "next";
import Image from "next/image";
import {humanReadableInterval} from "@/utils/date-utils";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import Head from "next/head";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"]});

type HomeProps = { receitas: Receita[] }

export default function Home({receitas: initialReceitas}: HomeProps) {
  const [receitas, setReceitas] = useState(initialReceitas)
  const [isDeleting, setIsDeleting] = useState(false)
  const handleExcluir = (receita: Receita) => async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDeleting(true)

    try {
      await ReceitasAPI.deletar(receita.id)
      setReceitas(receitas.filter((r) => r.id !== receita.id))
      toast.success('Receita excluída com sucesso')
    } catch (e) {
      toast.error('Erro ao excluir a receita')
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <>
      <Head>
        <title>Panela Mágica</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar/>

        <Main>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
            As melhores receitas para você
          </h1>

          <section className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3'>
            {receitas.map((receita) => (
              <Card key={receita.id}>
                <CardHeader className="p-0 overflow-hidden">
                  <Image
                    src={receita.imagem}
                    width="400"
                    height="225"
                    alt="Roasted Chicken"
                    className="aspect object-cover w-full"
                    style={{aspectRatio: "400/225", objectFit: "cover"}}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 py-2 px-4">
                    <h2 className="text-2xl font-semibold leading-none">{receita.nome}</h2>
                    <p className="text-sm/relaxed">por {receita.criador}</p>
                    <p className="text-sm/relaxed text-slate-500">{humanReadableInterval(receita.data_de_criacao)}</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex justify-between w-full gap-2">

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='secondary'><TrashIcon className='h-4 w-4'/></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>Deseja realmente excluir a receita?</AlertDialogHeader>
                        <AlertDialogDescription>
                          <p>Esta ação é irreversível e excluirá permanentemente a receita do Panela Mágica.</p>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>

                          <AlertDialogAction
                            disabled={isDeleting}
                            onClick={handleExcluir(receita)}
                          >
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>


                    <Link href={`/receitas/${receita.id}`}>
                      <Button variant='outline'>Ver Receita</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </section>

        </Main>
        <Toaster/>
        <Footer/>
      </div>
    </>
  );
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<HomeProps>> {
  const receitas = await ReceitasAPI.listar()
  return {props: {receitas}}
}
