This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Paso a paso para subir tus cambios a GitHub y actualizar Vercel
Asumiendo que ya tienes tu repositorio vinculado por primera vez, estos son los comandos que debes usar en tu Terminal 2:

1-Verificar el estado de tus archivos:

Revisa qué archivos has modificado o creado recientemente.
Bash
git status

2-Añadir los cambios:

Puedes agregar todos los archivos nuevos o modificados de golpe con:
Bash
git add .

3-Guardar los cambios (Hacer Commit):

Ponle un mensaje corto y descriptivo que indique qué hiciste (por ejemplo, corregir un diseño, agregar una sección, etc.).
Bash
git commit -m "Descripción breve de lo que cambiaste"

4-Subir los cambios a GitHub:

Envía tu código a la rama principal (suele llamarse main o master).
Bash
git push origin main


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
