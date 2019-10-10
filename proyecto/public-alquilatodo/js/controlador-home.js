$(document).ready(function(){
    obtenerSession();
    cargarSelectImagen();
    cargarPublicaciones();
});

function obtenerSession(){
    $.ajax({
        url:"/obtener-session",
        method:"GET",
        dataType:"json",
        success:function(res){
            $("#codigo-usuario").val(res.codigo_usuario);
        },
        error:function(error){
            console.error(error);
        }
    });
}

function cargarSelectImagen(){
    $.ajax({
        url:"/cargar-imagen",
        method:"GET",
        dataType:"json",
        success:function(res){
            res.forEach(function(element) {
                $("#slc-imagenes").append(
                    `<option value="${element.url}">${corregirUrl(element.url)}</option>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

function corregirUrl(url){
    var correccion = url.split("/");
    return correccion[correccion.length-1];
}

$("#btn-publicar-datos").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "codigo_usuario_propietario=" + $("#codigo-usuario").val() + "&nombre_producto=" + $("#nombre-producto-modal").val() + "&descripcion=" + $("#descripcion-producto-modal").val() + "&precio_producto=" + $("#precio-producto-modal").val() + "&estado_producto=" + $("#estado-producto-modal").val() + "&unidades=" + $("#unidades-modal").val() + "&cantidad_disponible=" + $("#unidades-modal").val() + "&fecha_publicacion=" + fecha;

    if(
        $("#nombre-producto-modal").val() == "" ||
        $("#descripcion-producto-modal").val() == "" ||
        $("#precio-producto-modal").val() == "" ||
        $("#estado-producto-modal").val() == "" ||
        $("#unidades-modal").val() == "" ||
        $("#slc-imagenes").val() == 0
    ){
        alert("Por favor llenar todos los campos");
    } else {
        $.ajax({
            url:"/crear-publicacion-producto",
            method:"POST",
            data:datos,
            dataType:"json",
            success:function(res){
                crearFoto(res.insertId);
                window.setTimeout(function(){
                    window.location.href = "/home.html";
                }, 1500);
            },
            error:function(error){
                console.error(error);
            }
        });
        $("#contenedor-publicaciones").html("");
        cargarPublicaciones();
    }
});

function crearFoto(idProducto){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "codigo_producto=" + idProducto + "&url=" + $("#slc-imagenes").val() + "&fecha_creacion=" + fecha;
    $.ajax({
        url:"/crear-foto",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            /* window.setTimeout(function(){
                window.location.href = "/home.html";
            }, 1000); */
        },
        error:function(error){
            console.error(error);
        }
    });
}

function cargarPublicaciones(){
    $.ajax({
        url:"/cargar-publicaciones",
        method:"GET",
        dataType:"json",
        success:function(res){
            res.forEach(function(element) {
                $("#contenedor-publicaciones").append(
                `<div class="card" style="width: 18rem; height: 20rem;">
                    <input id="codigo-usuario-propietario" type="hidden" value="${element.codigo_usuario_propietario}">
                    <img src="${element.url}" class="card-img-top" alt="La imagen no existe">
                    <div class="card-body">
                        <h5 class="card-title">Producto: ${element.nombre_producto}</h5>
                        <p class="card-text">Descripció: ${element.descripcion}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Precio: ${element.precio_producto}</li>
                        <li class="list-group-item">Estado del Producto: ${element.estado_producto}</li>
                        <li class="list-group-item">Disponibles: ${element.cantidad_disponible}</li>
                        <li class="list-group-item">Fecha de Publicación: ${corregirFecha(element.fecha_publicacion)}</li>
                    </ul>
                    <div class="card-body">
                        <button class="btn btn-secondary" id="btn-detalles-producto" onclick="cargarInfoProducto(${element.codigo_producto});" data-toggle="modal" data-target="#detalles-producto">Detalles</button>
                    </div>
                </div>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

function corregirFecha(fecha){
    var correccion = fecha.split("T");
    return correccion[0];
}

/* Cierre de Sesión */
$("#cerrar-sesion").click(function(){
    $.ajax({
        url:"/cerrar-session",
        method:"GET",
        success:function(res){
            console.log(res);
            window.location.href = "/index.html";
        },
        error:function(error){
            console.error(error);
        }
    });
});

function cargarInfoProducto(codigo_producto){
    var datosUsuario = `codigo_usuario=` + $("#codigo-usuario-propietario").val();
    $.ajax({
        url:"/informacion-usuario",
        method:"GET",
        data:datosUsuario,
        dataType:"json",
        success:function(res){
            $("#span-nombre").html(res[0].nombre + " " + res[0].apellido);
            $("#span-correo").html(res[0].correo);
            $("#span-telefono").html(res[0].telefono);
        },
        error:function(error){
            console.error(error);
        }
    });

    var datos = "codigo_producto=" + codigo_producto;
    $.ajax({
        url:"/publicacion-especifica",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#span-nombre-producto").html(res[0].nombre_producto);
            $("#span-precio").html(res[0].precio_producto);
        },
        error:function(error){
            console.error(error);
        }
    });
}