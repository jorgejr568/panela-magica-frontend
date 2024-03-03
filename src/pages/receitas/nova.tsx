import Head from "next/head";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Footer, Main, Navbar} from "@/components";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "@heroicons/react/24/outline";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Form, FormField} from "@/components/ui/form";
import dynamic from "next/dynamic";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";
import {useRef} from "react";
import {cn} from "@/lib/utils";
import {ReceitasAPI, TIPOS_DE_RECEITA} from "@/API/receita";
import Router from "next/router";

const Editor = dynamic(() => import('@/components/Editor'), {ssr: false})
export const receitaFormSchema = z.object({
  criador: z.string({
    required_error: "O nome do criador é obrigatório"
  }).min(3, {
    message: "O nome do criador deve ter no mínimo 3 caracteres"
  }).max(50, {message: "O nome do criador deve ter no máximo 50 caracteres"}),
  tipo: z.enum(TIPOS_DE_RECEITA, {
    required_error: "O tipo da receita é obrigatório",
  }),
  imagem: z.any({
    required_error: "A imagem da receita é obrigatória"
  })
    .refine((file) => file instanceof File, {
      message: "A imagem precisa ser preenchida",
    })
    .refine((file) => file instanceof File && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type), {
      message: "A imagem deve ser do tipo jpeg, jpg ou png"
    })
    .refine((file) => file instanceof File && file.size <= 2 * 1024 * 1024, {
      message: "A imagem deve ter até 2mb"
    }),
  ingredientes: z.array(z.object({
    nome: z.string().min(3, {message: "O nome do ingrediente deve ter no mínimo 3 caracteres"}).max(50, {message: "O nome do ingrediente deve ter no máximo 50 caracteres"}),
    quantidade: z.string().min(1, {message: "A quantidade do ingrediente deve ter no mínimo 1 caractere"}).max(20, {message: "A quantidade do ingrediente deve ter no máximo 20 caracteres"})
  }), {
    required_error: "Deve haver pelo menos um ingrediente"
  }).min(1, {message: "Deve haver pelo menos um ingrediente"}).max(50, {message: "Deve haver no máximo 50 ingredientes"}),
  modo_de_preparo: z.string({
    required_error: "O modo de preparo é obrigatório"
  }).min(10, {
    message: "O modo de preparo deve ter no mínimo 30 caracteres"
  }).max(2048, {message: "O modo de preparo deve ter no máximo 2048 caracteres"}),
  nome: z.string({
    required_error: "O nome da receita é obrigatório"
  }).min(3, {
    message: "O nome da receita deve ter no mínimo 3 caracteres"
  }).max(50, {message: "O nome da receita deve ter no máximo 50 caracteres"})

})

export type ReceitaForm = z.infer<typeof receitaFormSchema>

const ingredinteVazio: () => ReceitaForm['ingredientes'][0] = () => ({nome: "", quantidade: ""})

export default function NovaReceita() {
  const imagemRef = useRef<HTMLInputElement>(null)

  const form = useForm<ReceitaForm>({
    defaultValues: {
      nome: "",
      criador: "",
      imagem: "",
      ingredientes: [
        ingredinteVazio()
      ],
      modo_de_preparo: "",
    },
  })

  const adicionarIngrediente = () => {
    form.setValue('ingredientes', [...form.getValues('ingredientes'), ingredinteVazio()])
  }

  const handleRemoveIngrediente = (index: number) => () => {
    form.setValue('ingredientes', form.getValues('ingredientes').filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: ReceitaForm) => {
    try {
      const result = await receitaFormSchema.safeParse({
        ...data,
        imagem: imagemRef.current?.files?.[0]
      })
      if (!result.success) {
        const uniqueErrorMessages = new Set(result.error.issues.map((issue) => issue.message))
        uniqueErrorMessages.forEach((message) => toast.error(message))
        return
      }

      const imageUrl = await ReceitasAPI.salvarImagem(result.data.imagem)
      const receita = await ReceitasAPI.cadastrar({...result.data, imagem: imageUrl})

      toast.success('Receita cadastrada com sucesso')
      await Router.push(`/receitas/${receita.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar a receita')
    }
  }

  return <>
    <Head>
      <title>Nova Receita | Panela Mágica</title>
    </Head>

    <Navbar/>
    <TooltipProvider>
      <Main>
        <h1
          className="text-3xl font-bold tracking-tight sm:text-5xl md:tracking-tighter/[-.5] lg:text-6xl lg:tracking-normal">
          Nova Receita
        </h1>

        <Form {...form}>
          <form className={'grid lg:grid-cols-2 gap-4 mt-6 md:gap-y-6 lg:gap-y-12'}
                onSubmit={form.handleSubmit(handleFormSubmit)}>
            <Label htmlFor="nome" className="lg:col-span-2 text-2xl">Informações Gerais</Label>

            <FormField
              control={form.control}
              name="nome"
              render={({field}) => (
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" type="text" placeholder="Nome da receita" {...field}/>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="criador"
              render={({field}) => (
                <div>
                  <Label htmlFor="criador">Tipo</Label>
                  <Select value={form.watch('tipo')} onValueChange={(value) => form.setValue('tipo', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo da receita'/>
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_DE_RECEITA.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="criador"
              render={({field}) => (
                <div>
                  <Label htmlFor="criador">Criador</Label>
                  <Input id="criador" type="text" placeholder="Seu nome" {...field}/>
                </div>
              )}
            />

            <div>
              <Label htmlFor="imagem">Foto da Receita</Label>
              <Input id="imagem" type="file"
                     accept="image/jpeg, image/jpg, image/png" ref={imagemRef}/>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-2">
              <Label className="text-2xl">Ingredientes</Label>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className='w-24'/>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {form.watch('ingredientes').map((ingrediente, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input type="text" placeholder="Ingrediente" {...form.register(`ingredientes.${index}.nome`)}/>
                      </TableCell>
                      <TableCell>
                        <Input type="text"
                               placeholder="Quantidade" {...form.register(`ingredientes.${index}.quantidade`)}/>
                      </TableCell>

                      <TableCell>
                        {index === 0 ? null :
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant='outline' type="button" onClick={handleRemoveIngrediente(index)}>
                                <TrashIcon className="h-4 w-4"/>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remover Ingrediente</p>
                            </TooltipContent>
                          </Tooltip>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right">
                      <Button variant='secondary' type="button" onClick={adicionarIngrediente}>Adicionar
                        Ingrediente</Button>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>


            <div className="lg:col-span-2 flex flex-col gap-2">
              <FormField control={form.control} name="modo_de_preparo" render={({field}) => (
                <div className='flex flex-col'>
                  <Label htmlFor="modo_de_preparo" className="text-2xl">Modo de Preparo</Label>
                  <div className="border mt-8 rounded-lg w-full">
                    <Editor markdown={field.value} onChange={(value) => {
                      form.setValue('modo_de_preparo', value)
                    }}/>
                  </div>
                </div>
              )}/>
            </div>


            <Button type="submit" className={cn('lg:col-span-2 mt-8', {
              'opacity-50': form.formState.isSubmitting
            })} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Receita'}
            </Button>
          </form>
        </Form>
      </Main>
    </TooltipProvider>
    <Toaster/>
    <Footer/>
  </>
}
