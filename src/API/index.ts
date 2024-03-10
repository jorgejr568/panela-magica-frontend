import {Receita, User} from "@/API/types";
import {AuthSession} from "@/utils/getAuthServerSideProps";

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
  salvarImagem: async (imagem: File, token: AuthSession['token']): Promise<string> => {
    const formData = new FormData()
    formData.append('imagem', imagem)
    const data = await fetch(`${BASE_URL}/receitas/imagem`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${token}`
      }
    })
    if (!data.ok) {
      throw new Error('Erro ao salvar a imagem')
    }
    return data.json()
  },
  cadastrar: async (receita: Omit<Receita, 'id' | 'data_de_criacao' | 'criador'>, token: AuthSession['token']): Promise<Receita> => {
    const data = await fetch(`${BASE_URL}/receitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(receita),
    })
    if (!data.ok) {
      throw new Error('Erro ao cadastrar a receita')
    }

    return data.json()
  },
  deletar: async (id: number, token: AuthSession['token']): Promise<void> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': `Bearer ${token}`,
      }
    })
    if (!data.ok) {
      throw new Error('Erro ao deletar a receita')
    }
  },
  atualizar: async (id: number, receita: Omit<Receita, 'id' | 'data_de_criacao' | 'criador'>, token: AuthSession['token']): Promise<Receita> => {
    const data = await fetch(`${BASE_URL}/receitas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(receita)
    })
    if (!data.ok) {
      throw new Error('Erro ao atualizar a receita')
    }

    return data.json()
  }
}

export const UserAPI = {
  signIn: async (username: string, password: string): Promise<(User & { token: AuthSession['token'] }) | null> => {
    const response = await fetch(`${BASE_URL}/users/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
      return null
    }

    return response.json()
  },

  me: async (token: AuthSession['token']) => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        'X-Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}

export * from './types'
