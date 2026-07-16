export const rootPath = process.env.BASE_URL ?? '/'

export function createElement(id: string) {
  if (!document.getElementById(id)) {
    const app = document.createElement('div')
    app.id = id

    document.body.appendChild(app)
  }
}

export function updateElement(id: string, html: string) {
  const app = document.getElementById(id)
  if (app) {
    app.innerHTML = html
  }
}
