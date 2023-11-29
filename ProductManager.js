const fs = require('fs').promises

class ProductManager {
    constructor(ruta) {
        this.ruta = ruta
    }

    async ObtenerProductos() {
        let datos = await fs.readFile(this.ruta, 'utf8')
        let productos = JSON.parse(datos)
        return productos
    }

    async AgregarProducto(producto) {
        let productos = await this.ObtenerProductos()
        productos.push(producto)
        await fs.writeFile(this.ruta, JSON.stringify(productos))
    }

    async EliminarProducto(codigo) {
        let productos = await this.ObtenerProductos()
        productos = productos.filter(producto => producto.codigo !== codigo)
        await fs.writeFile(this.ruta, JSON.stringify(productos))
    }

    async EditarProducto(codigo, producto) {
        let productos = await this.ObtenerProductos()
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].codigo === codigo) {
                productos[i] = producto
                break
            }
        }
        await fs.writeFile(this.ruta, JSON.stringify(productos))
    }

    async BorrarArchivo() {
        await fs.unlink(this.ruta)
    }
}

(async () => {
    const ruta = './productos.json'
    const PM = new ProductManager(ruta)

    await PM.AgregarProducto({ titulo: 'Lapicera', precio: 20, codigo: 'AAA001', stock: 10 })
    await PM.AgregarProducto({ titulo: 'Block de notas', precio: 70, codigo: 'AAA002', stock: 15 })
    await PM.AgregarProducto({ titulo: 'Recetario', precio: 200, codigo: 'AAA003', stock: 20 })
    await PM.AgregarProducto({ titulo: 'Tijera', precio: 30, codigo: 'AAA004', stock: 25 })

    let productos = await PM.ObtenerProductos()
    console.log('Productos:', productos)

    await PM.EditarProducto('AAA001', { titulo: 'Lapicera', precio: 20, codigo: 'AAA001', stock: 10 })
    productos = await PM.ObtenerProductos()
    console.log('Productos después de la edición:', productos)

    await PM.EliminarProducto('AAA002')
    productos = await PM.ObtenerProductos()
    console.log('Productos después de la eliminación:', productos)

    await PM.BorrarArchivo()
})()