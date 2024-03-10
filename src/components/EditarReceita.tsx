import {Receita, ReceitasAPI, TIPOS_DE_RECEITA} from "@/API";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Form, FormField} from "@/components/ui/form";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useRef, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import dynamic from "next/dynamic";
import {AuthSession} from "@/utils/getAuthServerSideProps";

const Editor = dynamic(() => import('@/components/Editor'), {ssr: false})

type EditarReceitaProps = {
  token: AuthSession['token']
  receita: Receita
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  afterSave?: (receita: Receita) => void
}

export function EditarReceitaSheet(props: EditarReceitaProps) {
  const [receita, setReceita] = useState(props.receita)
  const editarImagemRef = useRef<HTMLInputElement>(null)
  const form = useForm<EditarReceitaForm>({
    defaultValues: {
      tipo: receita.tipo as typeof TIPOS_DE_RECEITA[number],
      imagem: '',
      ingredientes: receita.ingredientes,
      modo_de_preparo: receita.modo_de_preparo,
      nome: receita.nome
    }
  })


  const adicionarIngrediente = () => {
    form.setValue('ingredientes', [...form.getValues('ingredientes'), {nome: '', quantidade: ''}])
  }

  const removerIngrediente = (index: number) => {
    form.setValue('ingredientes', form.getValues('ingredientes').filter((_, i) => i !== index))
  }

  const handleSalvar = async (data: EditarReceitaForm) => {
    const result = atualizarReceitaSchema.safeParse({
      ...data,
      imagem: editarImagemRef.current?.files?.[0]
    })
    if (!result.success) {
      const uniqueErrorMessages = new Set(result.error.issues.map((issue) => issue.message))
      uniqueErrorMessages.forEach((message) => toast.error(message))
      return
    }

    const imagem = editarImagemRef.current?.files?.[0]
    let novaImagemUrl = receita.imagem
    if (imagem) {
      novaImagemUrl = await ReceitasAPI.salvarImagem(imagem, props.token)
    }

    const novaReceita = {
      ...result.data,
      imagem: novaImagemUrl
    }

    const receitaAtualizada = await ReceitasAPI.atualizar(receita.id, novaReceita, props.token)

    toast.success('Receita atualizada com sucesso')

    const receitaAtualizadaComImagemLocal = {
      ...receitaAtualizada,
      imagem: imagem ? URL.createObjectURL(imagem) : novaImagemUrl
    }

    form.resetField('imagem')
    props.onOpenChange(false)
    props.afterSave && props.afterSave(receitaAtualizadaComImagemLocal)
  }

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onOpenChange} modal>
      <SheetContent className='w-full sm:max-w-full lg:max-w-1/2'>
        <SheetHeader>
          <SheetTitle>Editando receita #{receita.id}</SheetTitle>
          <SheetDescription>
            As alterações feitas aqui não serão salvas automaticamente. Clique em "Salvar" para confirmar as
            alterações.

            <Form {...form} >
              <form onSubmit={form.handleSubmit(handleSalvar)} className='grid gap-4 mt-8 border'>
                <ScrollArea className='max-h-[65vh] lg:max-h-[72vh] xl:max-h-[80vh]'>
                  <div className="px-4 py-2 space-y-4">
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
                      name="tipo"
                      render={({field}) => (
                        <div>
                          <Label htmlFor="tipo">Tipo</Label>
                          <Select value={form.watch('tipo')}
                                  onValueChange={(value) => form.setValue('tipo', value as any)}>
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
                      name="imagem"
                      render={({field}) => (
                        <div>
                          <Label htmlFor="imagem">Imagem</Label>
                          <Input id="imagem" type="file" {...field} ref={editarImagemRef}/>
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ingredientes"
                      render={({field}) => (
                        <div>
                          <Label>Ingredientes</Label>
                          <div className='grid gap-4 my-4'>
                            {form.watch('ingredientes').map((ingrediente, index) => {
                              return <div key={index} className='grid gap-y-4 gap-x-2 grid-cols-4'>
                                <Input type='text'
                                       className='col-span-2'
                                       placeholder='Nome do ingrediente' {...form.register(`ingredientes.${index}.nome`)}/>
                                <Input type='text'
                                       placeholder='Quantidade' {...form.register(`ingredientes.${index}.quantidade`)}/>

                                {index > 0 &&
                                    <Button variant='outline' onClick={() => removerIngrediente(index)}>
                                        <TrashIcon className='h-4 w-4'/>
                                    </Button>}
                              </div>
                            })}
                          </div>

                          <div className="flex justify-end">
                            <Button variant='secondary' onClick={adicionarIngrediente}>
                              Adicionar ingrediente
                            </Button>
                          </div>
                        </div>
                      )}
                    />

                    <div>
                      <Label htmlFor="modo_de_preparo">Modo de preparo</Label>
                      <Editor
                        markdown={form.watch('modo_de_preparo')}
                        onChange={(value) => form.setValue('modo_de_preparo', value)}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </form>
            </Form>
          </SheetDescription>

          <SheetFooter>
            <Button variant='secondary' onClick={() => props.onOpenChange(false)}>Cancelar</Button>
            <Button onClick={form.handleSubmit(handleSalvar)}>Salvar</Button>
          </SheetFooter>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export const useEditarReceitaSheet = (receita: Receita, token: AuthSession['token']): EditarReceitaProps => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    token,
    receita,
    isOpen,
    onOpenChange: setIsOpen,
  }
}


const atualizarReceitaSchema = z.object({
  tipo: z.enum(TIPOS_DE_RECEITA, {
    required_error: "O tipo da receita é obrigatório",
  }),
  imagem: z.any({})
    .refine((file) => file instanceof File || !file, {
      message: "A imagem precisa ser preenchida",
    })
    .refine((file) => !(file instanceof File) || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type), {
      message: "A imagem deve ser do tipo jpeg, jpg ou png"
    })
    .refine((file) => !(file instanceof File) || file.size <= 2 * 1024 * 1024, {
      message: "A imagem deve ter até 2mb"
    })
    .optional(),
  ingredientes: z.array(z.object({
    nome: z.string().min(3, {message: "O nome do ingrediente deve ter no mínimo 3 caracteres"}).max(100, {message: "O nome do ingrediente deve ter no máximo 50 caracteres"}),
    quantidade: z.string().min(1, {message: "A quantidade do ingrediente deve ter no mínimo 1 caractere"}).max(50, {message: "A quantidade do ingrediente deve ter no máximo 20 caracteres"})
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

type EditarReceitaForm = z.infer<typeof atualizarReceitaSchema>
