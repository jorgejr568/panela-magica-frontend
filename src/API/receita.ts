type Ingrediente = {
  nome: string
  quantidade: string
}

export const TIPOS_DE_RECEITA = [
  'doce',
  'sopa',
  'massa',
  'salada',
  'carnes',
  'peixes',
  'bebidas',
  'lanches',
  'pães',
  'bolos',
  'tortas',
  'sobremesas',
  'salgado',
  'outros'
] as const

export type Receita = {
  id: number
  nome: string
  tipo: typeof TIPOS_DE_RECEITA[number] | (string & {})
  criador: string
  ingredientes: Ingrediente[]
  modo_de_preparo: string
  imagem: string
  data_de_criacao: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const ReceitasAPI = {
  listar: async (): Promise<Receita[]> => {
    const data = await fetch(`${BASE_URL}/receitas`)
    if (!data.ok) {
      throw new Error('Erro ao buscar as receitas')
    }


    return data.json()
  },
  buscar: async (id: number): Promise<Receita | null> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`)
    if (!data.ok) {
      if (data.status === 404) {
        return null
      }
      
      throw new Error('Erro ao buscar a receita')
    }

    return data.json()
  },
  salvarImagem: async (imagem: File): Promise<string> => {
    const formData = new FormData()
    formData.append('imagem', imagem)
    const data = await fetch(`${BASE_URL}/receitas/imagem`, {
      method: 'POST',
      body: formData
    })
    if (!data.ok) {
      throw new Error('Erro ao salvar a imagem')
    }
    return data.json()
  },
  cadastrar: async (receita: Omit<Receita, 'id' | 'data_de_criacao'>): Promise<Receita> => {
    const data = await fetch(`${BASE_URL}/receitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(receita)
    })
    if (!data.ok) {
      throw new Error('Erro ao cadastrar a receita')
    }

    return data.json()
  },
  deletar: async (id: number): Promise<void> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`, {
      method: 'DELETE'
    })
    if (!data.ok) {
      throw new Error('Erro ao deletar a receita')
    }
  },
  atualizar: async (id: number, receita: Omit<Receita, 'id' | 'data_de_criacao'>): Promise<Receita> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(receita)
    })
    if (!data.ok) {
      throw new Error('Erro ao atualizar a receita')
    }

    return data.json()
  }
}
