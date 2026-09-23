# Yggdrasil (FrontEnd)

El FrontEnd del proyecto está desarrollado sobre los siguientes componentes básicos:

- Sistema operativo: Windows 11
- Versión de Node.js: 22.11.0
- Versión de NPM: 10.9.0
- Versión de Vite: 6.3.5

## Ignición del FrontEnd

Se usará Vite con React. Los comandos de arranque fueron:

```bash
npm create vite@latest yggdrasil -- --template react
```

Una vez terminó de crear el proyecto, para levantar el proyecto arrojó los siguientes comandos:

```bash
cd yggdrasil
npm install
npm run dev
```

También arrojó la siguiente ayuda:

```bash
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

Para tener un mejor control de las dependencias del proyecto, se eliminaron del ```package.json``` los acentos circunflejos o carets usando el comando:

```bash
npm list --depth=0
```

## Deployment

El proyecto se compila a código que puede llevarse a producción con el siguiente comando:

```bash
npm run build
```

Esto creará la carpeta `build` que podrá usarse como un sitio web frontend estático listo para llevarse a producción.

Actualmente no existe un CI/CD que lo lleve automáticamente generando la build o con un push de Git.