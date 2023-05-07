function generarCategorias() {

    axios({
        method: 'GET',
        url: 'http://localhost:4201/categorias'
    })
        .then(res => {
            categorias = res.data;
            sectionCategorias.innerHTML = '<div class="titulo-section">Categorías</div>';
            categorias.forEach((categoria, indice) => {
                sectionCategorias.innerHTML +=
                    `<div class="col-12 col-sm-6 col-md-4">
                    <div class="card" class="card flex-row div-categoria sombra" onclick="generarEmpresas('${categoria._id}');">
                        <img class="card-img-left example-card-img-responsive" src="${categoria.imagen}" />
                        <h5 class="h5-categoria">${categoria.nombre}</h5>
                    </div>
                </div>`;
            });
        })
}

function generarEmpresas(codigoCategoria) {

    axios({
        method: 'GET',
        url: 'http://localhost:4201/empresas'
    })
        .then(res => {
            empresas = res.data;
            let filtro = empresas.filter(empresa => empresa.codigoCategoria == codigoCategoria);
            categoriaActual = categorias.filter(categoria => categoria._id == codigoCategoria)[0];
            sectionCategorias.style.display = 'none';
            sectionEmpresas.innerHTML = `<div class="titulo-section">${categoriaActual.nombre}</div>`;
            filtro.forEach((empresa) => {

                estrellas = '';
                for (let i = 0; i < empresa.calificacion; i++) {
                    estrellas += '<i class="fa-solid fa-star"></i>';
                }
                for (let i = 0; i < 5 - empresa.calificacion; i++) {
                    estrellas += '<i class="fa-regular fa-star"></i>';
                }

                sectionEmpresas.innerHTML +=
                    `<div class="col-12 col-sm-6">
                        <div class="card borde div-empresa sombra" onclick="generarProductos('${empresa._id}');">
                            <div class="card-img banner" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${empresa.banner}); background-repeat: no-repeat; background-size: 100% 100%">
                            </div>
                            <div class="card-img-overlay">
                                <h5 class="card-title text-white h5-empresa">${empresa.nombre}</h5>
                            </div>
                            <div class="card flex-row content-empresa">
                                <img class="card-img-left example-card-img-responsive" src="${empresa.logo}" />
                                <div class="contenido-empresa">
                                    <h6>Descripción:</h6>
                                    <p>${empresa.descripcion}</p>
                                    <div class="calificacion">
                                        <h6>Calificación:</h6>
                                        <div class="estrellas">
                                            ${estrellas}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });

            sectionEmpresas.style.display = 'flex';
        })
}

function generarProductos(codigoEmpresa) {

    emp = empresas.filter(empresa => empresa._id == codigoEmpresa)[0].nombre;

    axios({
        method: 'GET',
        url: 'http://localhost:4201/productos'
    })
        .then(res => {
            productos = res.data;
            let filtro = productos.filter(producto => producto.codigoEmpresa == codigoEmpresa);
            empresaActual = empresas.filter(empresa => empresa._id == codigoEmpresa)[0];
            sectionEmpresas.style.display = 'none';
            sectionProductos.innerHTML = `<div class="titulo-section">${empresaActual.nombre}</div>`;
            filtro.forEach((producto) => {
                sectionProductos.innerHTML +=
                    `<div class="col-12 col-md-6 col-lg-4">
                        <div class="cards" class="card flex-row div-producto sombra" onclick="seleccionarProducto('${producto._id}');">
                            <img class="card-img-left example-card-img-responsive" src="${producto.imagen}" />
                            <div class="contenido-producto">
                                <h6 class="mb-2">${producto.nombre}</h6>
                                <div class="contenidoDescripcion">
                                    <p>${producto.descripcion}</p>
                                </div>
                                <h6 class="precio-producto">L. ${producto.precio}</h6>
                            </div>
                        </div>
                    </div>`;
            });

            sectionProductos.style.display = 'flex';
        })
}

function seleccionarProducto(codigoProducto) {
    productoActual = productos.filter(producto => producto._id == codigoProducto)[0];
    modalBodyCliente.innerHTML =
        `<h5 class="titulo-modal mb-5 mt-3">Cantidad de productos:</h5>
        <input id="cantidadProductos" class=" mb-5" type="number" min="1" max="${productoActual.cantidad}" value="1">
        <div class="botones-modal mb-3">
            <button class="boton boton3" onclick="cerrarModal();">Cerrar</button>
            <button class="boton boton4" onclick="agregarAlCarrito();">Aceptar</button>
        </div>`;
    abrirModal();
}

function abrirModal() {
    $('#modal').modal('show');
}

function abrirModal2() {
    $('#modal2').modal('show');
}

function cerrarModal() {
    $('#modal').modal('hide');
    modalBodyCliente.parentNode.classList.add('borde');
    modalBodyCliente.parentNode.classList.remove('borde');
}

function cerrarModal2() {
    $('#modal2').modal('hide');
    modalBodyCliente2.parentNode.classList.add('borde');
    modalBodyCliente2.parentNode.classList.remove('borde');
}

function agregarAlCarrito() {
    let spinCantidad = document.getElementById('cantidadProductos');
    let n = Number(spinCantidad.value);

    if ((n % 1 != 0) || n < 1) {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¡Cantidad inválida!</h5>
            <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h6 class="subtitulo-modal">Ingrese un entero mayor que 0.</h6>
            <button class="boton boton3my-4" onclick="cerrarModal2(); abrirModal();">Aceptar</button>`;
        cerrarModal();
        abrirModal2();
    } else {

        axios({
            method: 'get',
            url: `http://localhost:4201/sesiones/${idSession}`,
        })
            .then(res => {
                 if (res.data.codigo == 0) {
                    modalBodyCliente.parentNode.classList.add('borde');
                    modalBodyCliente.parentNode.classList.remove('borde');
                    modalBodyCliente.innerHTML =
                    `<h5 class="titulo-modal my-4">¡No estás registrado!</h5>
                     <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
                   </div>
                   <h6 class="subtitulo-modal">Regístrate para poder comprar.</h6>
                     <button class="boton boton3 my-4" onclick="cerrarModal();">Aceptar</button>`;
                 } else {
                    carrito.push(
                        {
                            codigo: productoActual._id,
                            imagen: productoActual.imagen,
                            nombre: productoActual.nombre,
                            cantidad: Number(spinCantidad.value),
                            descripcion: productoActual.descripcion,
                            precio: Number(productoActual.precio),
                            empresa: emp
                        }
                    );
                
                    contador = carrito.length;
                    divContador.innerHTML = contador;

                    carritoActualizar();

                    axios({
                        method: 'PUT',
                        url: `http://localhost:4201/productos/cantidad/${productoActual._id}`,
                        data: {cantidad: Number(spinCantidad.value)}
                    })
                
                    cerrarModal();
            }
            })

    }
}

function carritoActualizar() {
    contador = carrito.length;
    divContador.innerHTML = contador;
    axios({
        method: 'PUT',
        url: `http://localhost:4201/usuarios/carrito/${idUsuario}`,
        data: carrito
    })
}

function carritoObtener() {
    axios({
        method: 'GET',
        url: `http://localhost:4201/usuarios/carrito/${idUsuario}`
    })
        .then((res) => {
            carrito = res.data
            contador = carrito.length;
            divContador.innerHTML = contador;
        })
}

function abrirCarrito() {
    renderizarCarrito();
    abrirModal();
}

function renderizarCarrito() {
    subtotal = 0;
    if (carrito.length == 0) {
        modalBodyCliente.innerHTML =
            `<h5 class="titulo-modal my-3">Carrito de compras</h5>
        <i class="fa-solid fa-cart-shopping carrito-modal my-4"></i>
        <h6 class="subtitulo-modal mb-2">Carrito vacío</h6>
        <p class="parrafo-modal mb-3">Agrega productos para empezar.</p>
        <button class="boton boton3 mb-3" onclick="cerrarModal();">Cerrar</button>`;
    } else {
        let productosCarrito = '';
        carrito.forEach((producto, indice) => {
            subtotal += producto.precio * producto.cantidad;
            productosCarrito +=
                `<div class="card flex-row borde-verde div-producto mb-1">
                    <img class="card-img-left example-card-img-responsive" src="${producto.imagen}" />
                    <div class="contenido-producto">
                        <div class="float-right eliminarProducto" onclick="eliminarDelCarrito(${indice})"><i class="fa-solid fa-trash-can"></i></div>
                        <br>
                        <h6>${producto.nombre}</h6>
                        <div class="contenidoDescripcion">
                            <p>${producto.descripcion}</p>
                        </div>
                        <h6 class="precio-producto">L. ${producto.precio} x ${producto.cantidad}</h6>
                    </div>
                </div>`;
        });
        isv = subtotal * 0.15;
        comisiones = subtotal * 0.15;
        total = subtotal + isv + comisiones;
        modalBodyCliente.innerHTML =
            `<h5 class="titulo-modal my-3">Carrito de compras</h5>
        ${productosCarrito}
        <div class="total mt-3">
            <div class="carrito">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div class="detalle-total mb-4">
                <h6 class="negro">Subtotal:</h6>
                <h6 class="gris mb-3">L. ${subtotal.toFixed(2)}</h6>
                <h6 class="negro">ISV (15%):</h6>
                <h6 class="gris mb-3">L. ${isv.toFixed(2)}</h6>
                <h6 class="negro">Comisiones (15%):</h6>
                <h6 class="gris mb-3">L. ${comisiones.toFixed(2)}</h6>
                <h6 class="negro">TOTAL:</h6>
                <h6 class="gris mb-3">L. ${total.toFixed(2)}</h6>
            </div>
        </div>
        <div class="botones-modal mb-3">
            <button class="boton boton3" onclick="cerrarModal();">Cerrar</button>
            <button class="boton boton4" onclick="comprar(); cargarMapa();">Comprar</button>
        </div>`;
    }
}

function eliminarDelCarrito(indice) {
    axios({
        method: 'PUT',
        url: `http://localhost:4201/productos/cantidad/${carrito[indice].codigo}`,
        data: {cantidad: -carrito[indice].cantidad}
    })
        .then(() => {
            carrito.splice(indice, 1);
            carritoActualizar();
            contador = carrito.length;
            divContador.innerHTML = contador;
            renderizarCarrito();
        })
}

function comprar() {
    modalBodyCliente.innerHTML =
        `<h5 class="titulo-modal my-3">Finalizar compra</h5>
        <label class="form-control mt-2 border-0">Celular:</label>
        <input class="form-control" type="text" id="text-celular" placeholder="xxxx-xxxx" required>
        <label class="form-control mt-2 border-0">Correo:</label>
        <input class="form-control" type="text" id="text-correo" placeholder="xxxx@xxxx.com" required>
        <label class="form-control mt-2 border-0">Escribe tu dirección:</label>
        <textarea id="textDireccion" class="textarea-dirección form-control " rows="4" cols="50" required></textarea>
        <label class="form-control mt-2 border-0">Selecciona tu ubicación:</label>
        <div id="mapa" style="width: 100%; height: 200px;"></div>
        <input type="hidden" id="longitud" value="-87.17472108959961">
        <input type="hidden" id="latitud" value= "14.07425613883513">
        <label class="form-control mt-2 border-0">Información de tarjeta:</label>
        <div class="informacion-tarjeta  row pb-3">
            <div class="col-12">
                <label>Número:</label>
                <input class="form-control" type="text" id="text-numero" placeholder="xxxx-xxxx-xxxx-xxxx" required>
            </div>
            <div class="col-12">
                <label>Nombre:</label>
                <input class="form-control" type="text" id="text-nombre" placeholder="Nombre exacto" required>
            </div>
            <div class="col-6">
                <label>Expiración:</label>
                <input class="form-control" type="text" id="text-expiracion" placeholder="MM/AA" required>
            </div>
            <div class="col-6">
                <label>CVC:</label>
                <input class="form-control" type="text" id="text-cvc" placeholder="xxx" required>
            </div>
        </div>
        <div class="botones-modal my-3">
            <button class="boton boton3" onclick="cerrarModal();">Cerrar</button>
            <button class="boton boton4" onclick="validarFormulario();">Finalizar</button>
        </div>`;
}

function validarFormulario() {
    let txtcelular = document.getElementById('text-celular').value;
    let txtcorreo = document.getElementById('text-correo').value;
    let txtdireccion = document.getElementById('textDireccion').value;
    let txtnumero = document.getElementById('text-numero').value;
    let txtnombre = document.getElementById('text-nombre').value;
    let txtexpiracion = document.getElementById('text-expiracion').value;
    let txtcvc = document.getElementById('text-cvc').value;

    let expTelefono = /^\d{4}-\d{4}$/
    let expSeguridad = /^\d{3}$/
    let expFecha = /^(?:0?[1-9]|1[0-2])\/\d{2}$/
    let expTarjeta = /^\d{4}-\d{4}-\d{4}-\d{4}$/

    if (txtcelular == '' || txtcorreo == '' || txtdireccion == '' || txtnumero == '' || txtnombre == '' || txtexpiracion == '' || txtcvc == '') {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¡Algunos campos están vacíos!</h5>
            <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h6 class="subtitulo-modal">Por favor, rellene todos los campos.</h6>
            <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal();">Aceptar</button>`;
        
    } else if (!expCorreo.test(txtcorreo)) {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¡Correo inválido!</h5>
            <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h6 class="subtitulo-modal">Por favor, escribe un correo válido.</h6>
            <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal();">Aceptar</button>`;
        
    } else if (!expTelefono.test(txtcelular)) {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¡Teléfono inválido!</h5>
            <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h6 class="subtitulo-modal">Por favor, escribe un número válido.</h6>
            <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal();">Aceptar</button>`;
        
    } else if (!expTarjeta.test(txtnumero) || !expFecha.test(txtexpiracion) || !expSeguridad.test(txtcvc)) {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¡Datos de la tarjeta inválidos!</h5>
            <div class="error my-3">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h6 class="subtitulo-modal">Por favor, Revise sus datos.</h6>
            <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal();">Aceptar</button>`;
        
    } else {
        modalBodyCliente2.parentNode.classList.add('borde');
        modalBodyCliente2.parentNode.classList.remove('borde');
        modalBodyCliente2.innerHTML =
            `<h5 class="titulo-modal my-4">¿Está seguro que desea ya ordenar?</h5>
                <div class="advertencia my-3">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h6 class="subtitulo-modal">Esta acción no se puede revertir.</h6>
                <div class="botones-modal mt-4 mb-3">
                    <button class="boton boton3" onclick="cerrarModal2(); abrirModal();">Cerrar</button>
                    <button class="boton boton4" onclick="finalizarCompra();">Aceptar</button>
                </div>`;
    }
    cerrarModal();
    abrirModal2();
}


function finalizarCompra() {
    let txtcelular = document.getElementById('text-celular').value;
    let txtcorreo = document.getElementById('text-correo').value;
    let txtdireccion = document.getElementById('textDireccion').value;
    let longitud = document.getElementById('longitud').value;
    let latitud = document.getElementById('latitud').value;

    let o = {
        idCliente: idUsuario,
        nombre: carrito[0].empresa,
        estado: 'disponible',
        cliente: {
            nombre: nombreCliente,
            correo: txtcorreo,
            celular: txtcelular
        },
        envio: {
            productos: carrito,
            direccion: txtdireccion,
            empresa: carrito[0].empresa,
            subtotal: subtotal,
            total: total,
            coordenadas: {
                longitud: longitud,
                latitud: latitud
            },
            estado: null,
            isv: isv,
            comisionMotorista: subtotal * 0.1,
            comisionAdministrador: subtotal * 0.05
        },
        motorista: null
    }

    axios({
        method: 'POST',
        url: 'http://localhost:4201/ordenes',
        data: o
    })
        .then(res => {

            modalBodyCliente.parentNode.classList.remove('borde');
            modalBodyCliente.parentNode.classList.add('borde');

            modalBodyCliente.innerHTML =
                `<h5 class="titulo-modal my-4">¡Orden pendiente!</h5>
                <div class="check my-3">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h6 class="subtitulo-modal">${res.data.mensaje}</h6>
                <button class="boton boton3 my-4" onclick="cerrarModal();">Aceptar</button>`;

            carrito.length = 0;
            carritoActualizar();

            cerrarModal2();
            abrirModal();
        })
}

function irAtras() {
    if (sectionEmpresas.style.display == 'flex') {
        sectionEmpresas.style.display = 'none';
        sectionCategorias.style.display = 'flex';
    }
    if (sectionProductos.style.display == 'flex') {
        sectionProductos.style.display = 'none';
        sectionEmpresas.style.display = 'flex';
    }
}

function obtenerParametro(valor){
    valor = valor.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let expresionRegular = "[\\?&]" + valor + "=([^&#]*)";
    let regex = new RegExp(expresionRegular);
    let r = regex.exec( window.location.href );
    if( r == null )
        return "";
    else
        return decodeURIComponent(r[1].replace(/\ + /g, " "));
}

function cerrarSesion() {
    axios({
        method: 'get',
        url: `http://localhost:4201/sesiones/cerrar/${idSession}`
    })
}

function OrdenesPendientes() {
    axios({
        method: 'get',
        url: `http://localhost:4201/ordenes/pendientes/${idUsuario}`
    })
        .then(res => {
            if (res.data.length == 0) {
                modalBodyCliente.innerHTML =
                    `<h5 class="titulo-modal my-3">Ordenes pendientes</h5>
                    <i class="fa-solid fa-list carrito-modal my-4"></i>
                    <h6 class="subtitulo-modal mb-2">No tienes ordenes pendientes.</h6>
                    <p class="parrafo-modal mb-3">¡haz una orden para empezar!</p>
                    <button class="boton boton3 mb-3" onclick="cerrarModal();">Cerrar</button>`;
            } else {
                let ordenes = '';
                res.data.forEach(orden => {
                    let productos = '';
                    orden.envio.productos.forEach(producto => {
                        productos += producto.cantidad + ' ' + producto.nombre + '; ';
                    });
                    if (orden.estado == 'disponible') {
                        ordenes +=
                            `<div class="borde-verde my-1 py-1 orden-pendiente">
                                <h6 class="text-left pl-2">Orden: <span class="text-secondary">${productos}</span></h6>
                                <h6 class="text-right pr-2">Estado: <span class="text-danger">pendiente</span></h6>
                            </div>`;
                    } else {
                        ordenes +=
                            `<div class="borde-verde my-1 py-1 orden-pendiente">
                                <h6 class="text-left pl-2">Orden: <span class="text-secondary">${productos}</span></h6>
                                <h6 class="text-right pr-2">Estado: <span class="text-success">tomada</span></h6>
                            </div>`;
                    }
                    
                });
                modalBodyCliente.innerHTML =
                    `<h5 class="titulo-modal my-3">Ordenes pendientes</h5>
                    <div class="mt-3">
                        ${ordenes}
                    </div>
                    <div class="botones-modal mt-2 mb-3">
                        <button class="boton boton3" onclick="cerrarModal();">Cerrar</button>
                    </div>`;
            }
            abrirModal();
        })
}

function editUser() {
    modalBodyCliente.innerHTML = 
        `<div class="row my-4 mx-2">
            <h4 class="col-12 text-center titulo-modal mb-4">¿Qué quieres cambiar?</h4>
            <button class="boton boton4 col-12" style="height: 50px;" onclick="editarUsuario();">Cambiar usuario</button>
            <button class="boton boton3 col-12" style="height: 50px;" onclick="editarPassword();">Cambiar contraseña</button>
        </div>`;
    abrirModal();
}

function editarUsuario() {
    modalBodyCliente.innerHTML = 
        `<h4 class="text-center titulo-modal mt-4">Editar usuario</h4>
        <div>
            <h5 class="mt-3 text-left">Usuario actual:</h5>
            <input type="text" class="form-control " id="txtusuarioActual" required>
        </div>
        <div>
            <h5 class="mt-3 text-left">Nuevo usuario:</h5>
            <input type="text" class="form-control " id="txtusuarioNuevo" required>
        </div>
        <div>
            <h5 class="mt-3 text-left">Escribe tu contraseña:</h5>
            <input type="password" class="form-control " id="txtpassword" required>
        </div>
        <div class="text-center mb-4">
            <button class="boton boton4 mt-3" onclick="verificarCambioUsuario();">Aceptar</button>
            <button class="boton boton3 mt-3" onclick="cerrarModal();">Cancelar</button>
        </div>`;
}

function editarPassword() {
    modalBodyCliente.innerHTML = 
        `<h4 class="text-center titulo-modal mt-4">Editar contraseña</h4>
        <div>
            <h5 class="mt-3 text-left">Usuario:</h5>
            <input type="text" class="form-control " id="txtusuarioActual" required>
        </div>
        <div>
            <h5 class="mt-3 text-left">Contraseña actual:</h5>
            <input type="password" class="form-control " id="txtpasswordActual" required>
        </div>
        <div>
            <h5 class="mt-3 text-left">Nueva contraseña:</h5>
            <input type="password" class="form-control " id="txtpasswordNuevo" required>
        </div>
        <div>
            <h5 class="mt-3 text-left">Nueva contraseña (de nuevo):</h5>
            <input type="password" class="form-control " id="txtpasswordNuevo2" required>
        </div>
        <div class="text-center mb-4">
            <button class="boton boton4 mt-2" onclick="verificarCambioPassword();">Aceptar</button>
            <button class="boton boton3 mt-2" onclick="cerrarModal();">Cancelar</button>
        </div>`;
}

function verificarCambioUsuario() {
    let usuarioActual = document.getElementById('txtusuarioActual').value;
    let nuevoUsuario = document.getElementById('txtusuarioNuevo').value;
    let password = document.getElementById('txtpassword').value;

    if (usuarioActual != '' && nuevoUsuario != '' && password != '') {
        usuario = {
            usuario: usuarioActual,
            password: password,
            tipo: 'C'
        }
    
        axios({
            method: 'POST',
            url: 'http://localhost:4201/usuarios/login/C',
            data: usuario
        })
            .then(res => {
                if (res.data.codigo == 0) {
                    modalBodyCliente2.innerHTML =
                        `<h5 class="titulo-modal my-4">Usuario actual o contraseña incorrectas</h5>
                        <div class="error my-3">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </div>
                        <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal()">Aceptar</button>`;
                    cerrarModal();
                    abrirModal2();
                } else {
                    axios({
                        method: 'PUT',
                        url: `http://localhost:4201/usuarios/usuario/${idUsuario}`,
                        data: {usuario: nuevoUsuario}
                    })
                        .then(() => {
                            modalBodyCliente2.innerHTML =
                                `<h5 class="titulo-modal my-4">¡Usuario actualizado!</h5>
                                <div class="check my-3">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                                <button class="boton boton3 my-4" onclick="cerrarModal2();">Aceptar</button>`;
                            cerrarModal();
                            abrirModal2();
                        })
                }
                
            })
    }
}

function verificarCambioPassword() {
    let usuarioActual = document.getElementById('txtusuarioActual').value;
    let password = document.getElementById('txtpasswordActual').value;
    let passwordNuevo = document.getElementById('txtpasswordNuevo').value;
    let passwordNuevo2 = document.getElementById('txtpasswordNuevo2').value;

    if(usuarioActual != '' && password != '' && passwordNuevo != '' && passwordNuevo2 != '') {
        if (passwordNuevo != passwordNuevo2) {
            modalBodyCliente2.innerHTML =
                `<h5 class="titulo-modal my-4">Las contraseñas no coinciden</h5>
                <div class="error my-3">
                    <i class="fa-solid fa-circle-xmark"></i>
                </div>
                <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal()">Aceptar</button>`;
            cerrarModal();
            abrirModal2();
        } else {
            usuario = {
                usuario: usuarioActual,
                password: password,
                tipo: 'C'
            }
        
            axios({
                method: 'POST',
                url: 'http://localhost:4201/usuarios/login/C',
                data: usuario
            })
                .then(res => {
                    if (res.data.codigo == 0) {
                        modalBodyCliente2.innerHTML =
                            `<h5 class="titulo-modal my-4">Usuario actual o contraseña incorrectas</h5>
                            <div class="error my-3">
                                <i class="fa-solid fa-circle-xmark"></i>
                            </div>
                            <button class="boton boton3 my-4" onclick="cerrarModal2(); abrirModal()">Aceptar</button>`;
                        cerrarModal();
                        abrirModal2();
                    } else {
                        axios({
                            method: 'PUT',
                            url: `http://localhost:4201/usuarios/password/${idUsuario}`,
                            data: {password: passwordNuevo}
                        })
                            .then(() => {
                                modalBodyCliente2.innerHTML =
                                    `<h5 class="titulo-modal my-4">¡Contraseña actualizada!</h5>
                                    <div class="check my-3">
                                        <i class="fa-solid fa-circle-check"></i>
                                    </div>
                                    <button class="boton boton3 my-4" onclick="cerrarModal2();">Aceptar</button>`;
                                cerrarModal();
                                abrirModal2();
                            })
                    }
                    
                })
        }
    }
}


//############################################
var sectionCategorias = document.getElementById('section-categorias');
var sectionEmpresas = document.getElementById('section-empresas');
var sectionProductos = document.getElementById('section-productos');
var modalBodyCliente = document.getElementById('modal-body-cliente');
var modalBodyCliente2 = document.getElementById('modal-body-cliente2');
var divContador = document.getElementById('contador');
var categoriaActual;
var empresaActual;
var productoActual;
var subtotal = 0;
var isv = 0;
var comisiones = 0;
var total = 0;
var carrito = [];
var contador = 0;
var emp;
var expCorreo = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

var nombreCliente = obtenerParametro('nom');
var idSession = obtenerParametro('ses');
var idUsuario = obtenerParametro('id');



if (idSession.length == 0) {
    idSession = '1';
    idUsuario = '1';
} else {
    carritoObtener();
}

var categorias = [];
var empresas = [];
var productos = [];

generarCategorias();