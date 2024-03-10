import {getAuthServerSideProps} from "@/utils/getAuthServerSideProps";

export default function Logout() {
  return null
}

export const getServerSideProps = getAuthServerSideProps((ctx) => {
  ctx.res.setHeader('Set-Cookie', 'x-panela-magica-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')


  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
})
