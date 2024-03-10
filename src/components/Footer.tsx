import {SVGProps} from "react";
import {DateTime} from "luxon";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {LinkIcon} from '@heroicons/react/24/outline'

const year = DateTime.now().year

export function Footer() {
  const repoLinks = {
    'Frontend': 'https://github.com/jorgejr568/panela-magica-frontend',
    'Backend': 'https://github.com/jorgejr568/panela-magica-backend',
  }
  return <footer className="flex items-center justify-between h-14 px-4 border-t sm:px-6 mt-2">
    <div className="container flex items-center justify-between max-w-6xl mx-auto">
      <div className="text-xs text-gray-500">Copyright {year} © Panela Mágica</div>
      <div className="flex items-center space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="rounded-full bg-gray-100 w-8 h-8 flex items-center justify-center dark:bg-gray-800 cursor-pointer">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="w-4 h-4 fill-github dark:text-white"/>
            </button>
          </DialogTrigger>

          <DialogContent className='md:max-w-1/2'>
            <DialogTitle>
              Repositórios
            </DialogTitle>

            <DialogBody>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(repoLinks).map(([nome, link]) => (
                    <TableRow key={nome}>
                      <TableCell>{nome}</TableCell>
                      <TableCell>
                        <a href={link} target="_blank" rel="noreferrer" className='flex gap-2 items-center'>
                          <LinkIcon className="w-4 h-4"/>

                          {link}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogBody>

            <DialogFooter>
              <DialogClose>
                Fechar
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </footer>
}


function GithubIcon(props: SVGProps<any>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  )
}

