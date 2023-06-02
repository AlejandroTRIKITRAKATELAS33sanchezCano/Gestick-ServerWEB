import { db } from "../db.js";

const validateString = (data) => {
  const param = "{}$%#/&|<>`'";
  var result = true;
  result = data ? true : false;
  result = data != "" ? true : false;
  if (result) {
    for (var i = 0; i < data.length; i++) {
      result = param.indexOf(data.charAt(i)) == -1 ? true : false;
    }
  }
  return result;
};

///Guardar al admin en la base de datos.
export const signAdmin = async (req, res) => {
  var idAdmin = 0;
  var existingId = true;
  const { Name, AP, AM, PW, AE } = req.body;
  var data;

  try {
    const validation =
      validateString(Name) ||
      validateString(AP) ||
      validateString(AM) ||
      validateString(PW) ||
      validateString(AE)
        ? false
        : true;

    if (validation) {
      throw new Error("Datos no válidos");
    }

    while (existingId || idAdmin < 100000) {
      existingId = false;
      idAdmin = Math.floor(Math.random() * 1000000);
      [data] = await db.query(`select idAdmin from Admin;`);
      data.forEach((row) => {
        if (idAdmin === row.idAdministrador) {
          existingId = true;
        }
      });
    }

    const result = await db.query(
      "INSERT INTO Admin(idAdmin,AdNombre,AdAppat,AdApmat,AdContrasenna,Gestick_idGestick, Aactivo, AdEmail) VALUES (?,?,?,?,?,?, 1, ?)",
      [idAdmin, Name, AP, AM, PW, 1, AE]
    );
    console.log(result);
    res.json({ message: "Tarea fallada exitosamente", idAdmin });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

///Inicio de sesión para el administrador.
export const logAdmin = async (req, res) => {
  const { idAdmin, password } = req.body;
  console.log(idAdmin);
  console.log(password);

  try {
    const [results] = await db.query(`SELECT * FROM Admin WHERE idAdmin = ${idAdmin} And AdContrasenna = "${password}";`);

    console.log(results);

    if (results.length > 0) {
      console.log(results.length);
      res.json(results[0]);
    } else {
      res.json({ error: "ID Incorrectos O Contraseña Incorrecta" });
    }
  } catch (error) {
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
    console.log(error);
  }
};

//tablero Sesión

export const tableroAdmin = async (req, res) => { };

//ObtenerAdministradores

export const getAdministradores = async (req, res) => {
  const [result] = await db.query("SELECT * FROM Admin");
  console.log(result);
  res.json(result);
};

//Obtener Un Administrador

export const getAdministrador = async (req, res) => {
  const [result] = await db.query("SELECT * FROM Admin WHERE idAdmin = ?", [
    req.params.idAdmin,
  ]);

  if (result.length === 0) {
    return res.status(404).json({ message: "Administrador No Encontrado" });
  }

  res.json(result[0]);
};

//Eliminar Administrador

export const deleteAdministrador = async (req, res) => {
  const [result] = await db.query("DELETE FROM Admin WHERE idAdmin = ?", [
    req.params.idAdmin,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Administrador No existe" });
  }

  return res.sendStatus(204);
};

//Modificar Administrador

export const updateAdministrador = async (req, res) => {
  const { Name, AP, AM, PW } = req.body;

  const result = await db.query("UPDATE Admin SET ? WHERE idAdmin =?", [
    req.body,
    req.params.idAdmin,
  ]);
  res.json(result);
};

export const signEmp = async (req, res) => {
  const data = req.body;
  console.log(req.body);
  try {
    var id;
    var existingId = true;
    const banco =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let aleatoria = "";
    for (let i = 0; i < 10; i++) {
      aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
    }

    while (existingId) {
      existingId = false;
      id = Math.floor(Math.random() * 1000000);

      const [results] = await db.query(`select idEmpleado from Empleado;`);

      results.forEach((row) => {
        if (row.idEmpleado == id) {
          existingId = true;
          id = Math.floor(Math.random() * 1000000);
        }
      });
    }

    var setString = `insert into Empleado (idEmpleado, emapat, emamat, EmNombre, EmContrasenna, EmDireccion1, EmDireccion2, EmURLimg, Admin_idAdmin, Admin_Gestick_idGestick) values (${id},"${data.lastNameP}","${data.lastNameM}","${data.firstName}","${aleatoria}", "${data.address1}", "${data.address2}", "${data.img}", ${data.idAdmin}, 1)`;
    db.query(setString);
    res.json({ id: id, aleatoria: aleatoria });
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const logEmpleado = async (req, res) => {
  const { idEmp, password } = req.body;
  console.log(idEmp);
  console.log(password);
  try {
    const [data] = await db.query(
      `select * from Empleado where idEmpleado = ${idEmp} And EmContrasenna = "${password}" ;`
    );

    console.log(data);

    if (data.length === 0) {
      res.json({ error: "ID no registrado." });
    } else {
      data.forEach((row) => res.json(row));
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const getEmp = async (req, res) => {
  const data = req.body;
  try {
    const [results] = await db.query(
      `SELECT * FROM Empleado where Admin_idAdmin = ${data.idAdmin};`
    );
    console.log(results);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.json({
      error: "Hubo un error en el servidor, vuelva a intentarlo más tarde.",
    });
  }
};

export const getAnEmp = async (req, res) => {
  const id = req.body.idEmpleado;
  try {
    const [[data]] = await db.query(
      `SELECT * FROM Empleado WHERE idEmpleado = ${id}`
    );
    res.json(data);
  } catch (e) {
    res.json({ error: "chispas" });
  }
};

export const modifyEmp = async (req, res) => {
  const data = req.body;
  console.log(data);
  try{
    await db.query(`UPDATE Empleado SET EmNombre = "${data.firstName}", EmApat = "${data.lastNameP}", EmAmat = "${data.lastNameM}", EmDireccion1 = "${data.address1}", EmDireccion2 = "${data.address2}", EmURLimg = "${data.img}" WHERE idEmpleado = ${data.id}`);
    res.json({message:"Tarea fallada exitosamente"})
  }catch(e){
    console.log(e);
    res.json({error:"a"})
  }
};

export const deleteEmpleado = async (req, res) => {
  const data = req.body;
  try {
    await db.query(
      `DELETE FROM Empleado WHERE idEmpleado = ${data.idEmpleado}`
    );
    res.json({ message: "Se ha completado la operación exitosamente." });
  } catch (e) {
    res.json({
      message: "Hubo un error en el servidor, vuelva a intentarlo más tarde.",
    });
  }
};

export const stockPage = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const [results] = await db.query(
      `SELECT * from Productos a INNER JOIN Marca b on a.Marca_idMarca = b.idMarca where Admin_idAdmin = ${data.idAdmin} ;`
    );

    console.log(results);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const addProduct = async (req, res) => {
  var existingId = true;
  var id = 0;
  var ver = false;
  const data = req.body;
  try {
    while (existingId) {
      id = Math.floor(Math.random() * 1000000000);
      [ver] = await db.query(
        `select idProductos from Productos where idProductos = ${id};`
      );
      console.log(ver);
      if (ver.length === 0) {
        existingId = false;
      }
    }

    const response = await db.query(
      `INSERT INTO Productos (idProductos, PrNombre, PrPrecio, PrExistencias, PrDescripcion,Admin_idAdmin,Marca_idMarca,Categoria_idCategoria,Pcodigo,PrURLimg) VALUES (${id}, "${data.name}", ${data.price},${data.exis}, "${data.desc}", ${data.idAdmin},1,1,0,"${data.img}");`
    );
    console.log(response);

    res.json({});
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const modifyProduct = async (req, res) => {
  const data = req.body;
  try {
    await db.query(
      `update Productos SET PrNombre = "${data.name}", PrDescripcion = "${data.desc}", PrPrecio =${data.price}, PrExistencias =${data.exis}, Marca_idMarca =${data.tradeMark}, PrURLimg = "${data.img}" where idProductos = ${data.idP}`
    );
    res.json({message:"Tarea completada exitosamente."});
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const getAProduct =  async (req,res) => {
  console.log(req.body);
  try{
    const [[response]] = await db.query(`SELECT * FROM Productos WHERE idProductos = ${req.body.idProduct}`);
    console.log(response);
    res.json(response);
  }catch(e){
    console.log(e);
    res.json({error:"Hubo un error en el servidor, vuelva a intentarlo más tarde."})
  }
}

export const procesSale = async (req, res) => {
  const data = req.body;
  const date = new Date();
  const [year, month, day] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ];
  var existingId = true;
  var id = 0;
  console.log(data);
  try {
    while (existingId && id <= 1000000) {
      id = Math.floor(Math.random() * 10000000);
      const [response] = await db.query(
        `SELECT * FROM Carrito WHERE idCarrito = ${id}`
      );
      existingId = response.length === 0 ? true : false;
    }
    await db.query(
      `INSERT INTO Carrito (idCarrito, CarFecha, Total,idEmpleadoC) VALUES (${id}, "${year}-${month}-${day}", ${data.total}, ${data.id});`
    );

    data.carrito.forEach(async (product) => {
      const [[{ Marca_idMarca, Categoria_idCategoria }]] = await db.query(
        `SELECT Marca_idMarca, Categoria_idCategoria FROM Productos WHERE idProductos = ${product.idProductos}`
      );
      await db.query(
        `INSERT INTO Productos_has_Carrito(Productos_idProductos, Productos_Admin_idAdmin, Productos_Marca_idMarca, Productos_Categoria_idCategoria, Carrito_idCarrito, ProVendidos) VALUES (${product.idProductos}, ${data.idAdmin}, ${Marca_idMarca},${Categoria_idCategoria}, ${id}, ${product.quant})`
      );

      await db.query(
        `UPDATE Productos SET PrExistencias = PrExistencias - ${product.quant} WHERE idProductos = ${product.idProductos}`
      );
    });
    const [updatedData] = await db.query(
      `SELECT * FROM Productos WHERE Admin_idAdmin = ${data.idAdmin}`
    );
    console.log(updatedData);
    res.json(updatedData);
  } catch (e) {
    console.log(e);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    }); 
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await db.query(`DELETE from Productos_has_Carritowhere Productos_idProductos = ${req.body.idProductos}`);
    await db.query(`DELETE from Productos where idProductos = ${req.body.idProductos}`);

    res.redirect("/stock");
  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde.",
    });
  }
};

export const dashboardDUENNO = async (req, res) => {
  try {

    //FECHA

    let today = new Date();

    let anno = today.getFullYear();
    let mes = today.getMonth() + 1;
    let dia = today.getDate();

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    const daysInCurrentMonth = getDaysInMonth(anno, mes);
    console.log(daysInCurrentMonth);

    const daysBeforeMonth = getDaysInMonth(anno, mes - 1);
    console.log(daysBeforeMonth);

    //EMPLEADOS

    const [results1] = await db.query(`SELECT E.idEmpleado as 'Empleado' FROM Admin A JOIN Empleado E ON A.idAdmin = E.Admin_idAdmin where E.Admin_idAdmin=${req.body.idAdmin}`);

    console.log(results1);

    //PRODUCTOS ACTUALES
    let productosVendidosACTUALES = 0;

    await Promise.all(results1.map(async (element) => {
      const [[results2]] = await db.query(`SELECT SUM(provendidos) as 'productosVendidos' FROM Productos_has_Carrito JOIN Carrito ON Productos_has_Carrito.Carrito_idCarrito = Carrito.idCarrito WHERE Productos_has_Carrito.Productos_Admin_idAdmin = ${req.body.idAdmin} AND Carrito.CarFecha BETWEEN '${anno}-${mes}-01' AND '${anno}-${mes}-${daysInCurrentMonth}'`);
      productosVendidosACTUALES = parseInt(results2["productosVendidos"], 10) || 0;
      console.log(productosVendidosACTUALES)
    }));

    //PRODCUCTOS ANTERIORES

    let productosAnteriores = 0;

    await Promise.all(results1.map(async (element) => {
      const [[results3]] = await db.query(`SELECT SUM(provendidos) as 'productosVendidos' FROM Productos_has_Carrito JOIN Carrito ON Productos_has_Carrito.Carrito_idCarrito = Carrito.idCarrito WHERE Productos_has_Carrito.Productos_Admin_idAdmin = 1 AND Carrito.CarFecha BETWEEN '${anno}-${mes - 1}-01' AND '${anno}-${mes - 1}-${daysBeforeMonth}'`);
      productosAnteriores = parseInt(results3["productosVendidos"], 10) || 0;
      console.log(productosAnteriores)
    }));


    //VENTAS OBTENIDAS GENERAL

    let porcentajeVENTA = (productosVendidosACTUALES * 100) / productosAnteriores


    let porcentajeVENTAsin = porcentajeVENTA - 100;

    let porcentajeVENTAACTUAL = porcentajeVENTAsin.toFixed(2);

    console.log(productosVendidosACTUALES)
    console.log(productosAnteriores)
    console.log(porcentajeVENTA)
    console.log(porcentajeVENTAACTUAL);

    //CLIENTES/CARRITO VENDIDOS ACTUALES

    let totalactual = 0;

    await Promise.all(results1.map(async (element) => {
      const [[result]] = await db.query(`SELECT COUNT(idEmpleadoC) FROM Carrito WHERE CarFecha BETWEEN '${anno}-${mes}-01' AND '${anno}-${mes}-${daysInCurrentMonth}' AND Carrito.idEmpleadoC = ${element.Empleado}`);
      const count = parseInt(result["COUNT(idEmpleadoC)"], 10) || 0;
      totalactual += count;
    }));

    //Sacar Porcentaje de ventas

    let ventasMes = 0;

    await Promise.all(results1.map(async (element) => {
      const [[result]] = await db.query(`SELECT COUNT(idEmpleadoC) FROM Carrito WHERE CarFecha BETWEEN '${anno}-${mes - 1}-01' AND '${anno}-${mes - 1}-${daysBeforeMonth}' AND Carrito.idEmpleadoC = ${element.Empleado}`);
      const count = parseInt(result["COUNT(idEmpleadoC)"], 10) || 0;
      ventasMes += count;
    }));

    console.log(totalactual);
    console.log(ventasMes)

    let porcentajeNUMERO = (totalactual * 100) / ventasMes
    console.log(porcentajeNUMERO);

    let porcentajeSIN = porcentajeNUMERO - 100;

    let porcentajeACTUAL = porcentajeSIN.toFixed(2);

    //GANANCIAS TOTALES

    let gananciasACTUALES = 0;

    await Promise.all(results1.map(async (element) => {
      const [[result4]] = await db.query(`SELECT SUM(Total) as 'total de ganancias' FROM Carrito JOIN Productos_has_Carrito ON Carrito.idCarrito = Productos_has_Carrito.Carrito_idCarrito WHERE Productos_has_Carrito.Productos_Admin_idAdmin = ${req.body.idAdmin} AND Carrito.CarFecha BETWEEN '${anno}-${mes}-01' AND '${anno}-${mes}-${daysInCurrentMonth}'`);
      const count = parseInt(result4["total de ganancias"], 10) || 0;
      gananciasACTUALES = count;
    }));

    console.log(gananciasACTUALES)


    //PRODUCTOS VENDIDOS GRAFICAS

    const [empleadosResults] = await db.query(`SELECT EmNombre FROM Empleado Where Admin_idAdmin=${req.body.idAdmin}`);

    console.log(empleadosResults)


    //Nombres De los Empleados
    const empleadosEmNombres = empleadosResults.map((objeto) => {
      return objeto.EmNombre;
    });

    console.log(empleadosEmNombres)

    //Numero De Empleados

    const [[numeroDeEmpleadosCONSULTA]] = await db.query(`SELECT COUNT(*) FROM Empleado WHERE Empleado.Admin_idAdmin = ${req.body.idAdmin}`);

    console.log(numeroDeEmpleadosCONSULTA)

    const numeroDeEmpleados = parseInt(numeroDeEmpleadosCONSULTA['COUNT(*)']);

    console.log(numeroDeEmpleados)

    //Numero De Productos

    const [[numeroDeProductosCONSULTA]] = await db.query(`SELECT COUNT(*) FROM Productos WHERE Productos.Admin_idAdmin = ${req.body.idAdmin}`);

    console.log(numeroDeProductosCONSULTA)

    const numeroDeProductos = parseInt(numeroDeProductosCONSULTA['COUNT(*)']);

    console.log(numeroDeProductos)

    //Productos Vendidos En Total (Individuales)

    //En esta funcion se obtienen todos los nombres de los Productos que el Administrador Tenga Registrado En Su Base De Datos

    const [nombreProductosCONSULTA] = await db.query(`SELECT PrNombre FROM Productos WHERE Admin_idAdmin = ${req.body.idAdmin};`)

    const nombreProductos = nombreProductosCONSULTA.map(objeto => objeto.PrNombre);

    console.log(nombreProductos)


    //Suma De Todos Los Productos

    //ID DE EMPLEADOS

    const [idEmpleadosCONSULTA] = await db.query(`SELECT idEmpleado FROM Empleado WHERE Admin_idAdmin = ${req.body.idAdmin}`);

    console.log(idEmpleadosCONSULTA)

    const idEmpleados = idEmpleadosCONSULTA.map(objeto => objeto.idEmpleado);

    console.log(idEmpleados);

    //ID DE PRODUCTOS

    const [idProductosCONSULTA] = await db.query(`SELECT idProductos FROM Productos WHERE Admin_idAdmin = ${req.body.idAdmin}`);

    console.log(idProductosCONSULTA)

    const idProductos = idProductosCONSULTA.map(objeto => objeto.idProductos)

    console.log(idProductos)

    const resultados = [];

    for (let idEmpleadoC = 1; idEmpleadoC <= numeroDeEmpleados; idEmpleadoC++) {
      for (let idProductosC = 1; idProductosC <= numeroDeProductos; idProductosC++) {
        
        const query = `SELECT Productos.PrNombre as 'x', SUM(ProVendidos) as 'y' FROM Productos_has_Carrito
                        INNER JOIN Carrito ON Productos_has_Carrito.Carrito_idCarrito = Carrito.idCarrito 
                        INNER JOIN Productos ON Productos_has_Carrito.Productos_idProductos = Productos.idProductos 
                        WHERE Carrito.idEmpleadoC = ${idEmpleados[idEmpleadoC - 1]} 
                        AND Productos_has_Carrito.Productos_idProductos = ${idProductos[idProductosC - 1]}  
                        AND Productos_has_Carrito.Productos_Admin_idAdmin = ${req.body.idAdmin} 
                        AND Carrito.CarFecha BETWEEN '${anno}-${mes}-01' AND '${anno}-${mes}-${daysInCurrentMonth}' GROUP BY Productos.PrNombre`;
        
        console.log(query);
        
        const [resultado] = await db.query(query);
        
        console.log(resultado);


        if (resultado[0].y === null) {

          resultado[0].x = nombreProductos[idProductosC - 1];
          resultado[0].y = '0';
        }

        const integerY = parseInt(resultado[0].y)

        resultado[0].y = integerY

        const objetoProducto = resultado.pop();

        console.log(objetoProducto)

        resultados.push(objetoProducto);
      }
    }

    console.log(resultados);

    console.log("aquí está: " + resultados)

    //numeroDeEmpleados

    const ProductosEmpleado = [];

    for (let i = 0; i < numeroDeEmpleados; i++) {
      const inicio = i * numeroDeProductos;
      const fin = inicio + numeroDeProductos;

      const subarreglo = resultados.slice(inicio, fin);
      ProductosEmpleado.push(subarreglo);
    }

    const ProductosEmpleadoORDENADO = [];

    //console.log(ProductosEmpleado)

    for (const arreglo of ProductosEmpleado) {
      const arregloOrdenado = arreglo.slice().sort((a, b) => b.y - a.y);

      let otrosSumaY = 0;
      const arregloModificado = arregloOrdenado.map((objeto, indice) => {
        if (indice >= 9) {
          otrosSumaY += objeto.y;
          return null;
        }
        return objeto;
      }).filter(Boolean);

      if (otrosSumaY > 0) {
        arregloModificado.push({ x: 'Otros', y: otrosSumaY });
      } else if (otrosSumaY === 0) {
        arregloModificado.push({ x: 'Otros', y: 0 });
      }

      ProductosEmpleadoORDENADO.push(arregloModificado);
    }

    //console.log(ProductosEmpleadoORDENADO);

    //,numeroDeEmpleados:0,empleadosEmNombres:{},ProductosEmpleadoORDENADO:[]

    // Función para obtener un color aleatorio del banco de datos
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    /*Este es el paso final para así ya tener el DATA de las graficas del dashboard donde se utilizan las anteriores variables 
    ya propuestas:empleadosEmNombres:{},ProductosEmpleadoORDENADO:[]
    */


    const dataLINE = empleadosEmNombres.map((id, index) => {

      if (index != -1) {
        return {
          id: id,
          color: getRandomColor(),
          data: ProductosEmpleadoORDENADO[index].slice(0, 13).map((element) => {
            return {
              x: element.x,
              y: element.y,
            };
          }),
        };
      } else {
        console.log("chispas")
      }
    });

    // Imprimir el resultado
    console.log(dataLINE);

    //IMPIRMIR HISTORIAL DE CARRITO

    const [historialCARRITOconsulta] = await db.query(`SELECT idCarrito as 'txId', EmNombre as 'user', CarFecha as 'date', Total as 'cost' FROM Carrito INNER JOIN Empleado ON Carrito.idEmpleadoC = Empleado.idEmpleado AND Carrito.CarFecha between '${anno}-${mes}-01' AND '${anno}-${mes}-${daysInCurrentMonth}' AND Empleado.Admin_idAdmin = ${req.body.idAdmin}`)

    console.log(historialCARRITOconsulta)
    console.log(req.body.idAdmin)

    const historialCARRITO = historialCARRITOconsulta.map(objeto => {
      const { txId, user, date, cost } = objeto;
      const dateString = new Date(date).toISOString().split('T')[0];
      return { txId, user, date: dateString, cost };
    });

    console.log(historialCARRITO);


    res.json({

      //FECHA

      anno,
      mes,
      dia,

      //VENTAS

      productosVendidosACTUALES,
      porcentajeVENTAACTUAL,

      //CLIENTES NUEVOS
      totalactual,
      porcentajeACTUAL,

      //GANANCIAS TOTALES
      gananciasACTUALES,


      //Datos De Las Graficas
      dataLINE,

      //Historial de Carrito

      historialCARRITO
    })

  } catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde"
    });
  }
}

export const dashboardADMIN = async (req, res) => {
  try {

    //FECHA

    let today = new Date();

    let anno = today.getFullYear();
    let mes = today.getMonth() + 1;
    let dia = today.getDate();

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    const daysInCurrentMonth = getDaysInMonth(anno, mes);
    console.log(daysInCurrentMonth);

    const daysBeforeMonth = getDaysInMonth(anno, mes - 1);
    console.log(daysBeforeMonth);

    const [MembresiasCONSULTA] = await db.query(`SELECT COUNT(idAdmin) as 'Membresías' FROM Admin`);
    const [EmpleadosCONSULTA] = await db.query(`SELECT COUNT(idEmpleado) as 'empleados' FROM Empleado;`);

    const Empleados = EmpleadosCONSULTA.map(objeto => objeto.empleados)
    const Membresias = MembresiasCONSULTA.map(objeto => objeto.Membresías)

    const EmpleadosTOTAL = Empleados[0];
    const MembresiasTOTAL = Membresias[0];

    const UsuariosTOTAL = EmpleadosTOTAL + MembresiasTOTAL;

    const [GananciasUSUARIOSconsulta] = await db.query(`SELECT SUM(Total) as 'SumaCARRITO' FROM Carrito WHERE CarFecha BETWEEN '${anno}-01-01' AND '${anno}-12-31'`)

    const GananciasUSUARIOS = GananciasUSUARIOSconsulta.map(objeto => objeto.SumaCARRITO)

    const GananciasUsuariosTOTAL = GananciasUSUARIOS[0];

    const gananciasUsuariosMES = [];

    function getMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }

    for (let mes = 1; mes <= 12; mes++) {
      const fechaInicio = `${anno}-${mes.toString().padStart(2, '0')}-01`;
      const numeroDias = getMonthDays(anno, mes)
      const fechaFin = `${anno}-${mes.toString().padStart(2, '0')}-${numeroDias.toString().padStart(2, '0')}`;

      const [gananciasUsuariosConsulta] = await db.query(`SELECT SUM(Total) as 'SumaCARRITO' FROM Carrito WHERE CarFecha BETWEEN '${fechaInicio}' AND '${fechaFin}'`);

      const gananciaMes = gananciasUsuariosConsulta[0].SumaCARRITO || 0;
      gananciasUsuariosMES.push(gananciaMes);

      console.log(fechaInicio);
      console.log(fechaFin);

    }

    console.log(gananciasUsuariosMES);

    let data  = [{x:"Enero",y:'0'},{x:"Febrero",y:'0'},{x:"Marzo",y:'0'},{x:"Abril",y:'0'},{x:"Mayo",y:'0'},{x:"Junio",y:'0'},{x:"Julio",y:'0'},{x:"Agosto",y:'0'},{x:"Septiembre",y:'0'},{x:"Octubre",y:'0'},{x:"Noviembre",y:'0'},{x:"Diciembre",y:'0'}]
    
    data = data.map((element, index) => {
      element.y = gananciasUsuariosMES[index].toString();
      return element;
    });

    console.log(data);

    /*
    id: id,
          color: getRandomColor(),
          data: ProductosEmpleadoORDENADO[index].slice(0, 13).map((element) => {
            return {
              x: element.x,
              y: element.y,
            };
          }),
    */

    const dataLINE = [{
      id: "Ganancias",
      color : "#0DCAF0",
      data
    }]

    console.log(dataLINE);

    res.json({
      //Membresias
      MembresiasTOTAL,
      UsuariosTOTAL,
      GananciasUsuariosTOTAL,
      anno,
      dataLINE

    })

  }catch (error) {
    console.log(error);
    res.json({
      error: "Hubo un error en el servidor. Vuelva a intentarlo más tarde"
    });
  }}

export const historialVENTA = async(req,res) =>{
  try{


    function getMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }

    for (let mes = 1; mes <= 12; mes++) {
      const fechaInicio = `${anno}-${mes.toString().padStart(2, '0')}-01`;
      const numeroDias = getMonthDays(anno, mes)
      const fechaFin = `${anno}-${mes.toString().padStart(2, '0')}-${numeroDias.toString().padStart(2, '0')}`;

      const [gananciasProductosConsulta] = await db.query(`SELECT SUM(Total) as 'SumaCARRITO' FROM Carrito WHERE CarFecha BETWEEN '${fechaInicio}' AND '${fechaFin}'`);

      const gananciaProductos = gananciasProductosConsulta[0].SumaCARRITO || 0;
      gananciasUsuariosMES.push(gananciaProductos);

      console.log(fechaInicio);
      console.log(fechaFin);

    }

    console.log(gananciasUsuariosMES);
  }catch(error){
    console.log(error);
    res.json({
      error:"Chispas, Hubo Un Error En El Servidor. Vuelva A Intentarlo Más Tarde ÑAM"
    })
  }
}

export const getTradeMark = async (req,res) => {
  try{
    const [data] = await db.query("SELECT * FROM Marca ORDER BY MarNombre ASC");
    console.log(data);
    res.json(data)
  }catch(e){
    console.log(e);
    res.json({error:"Hubo un error en el servidor. Vuelva a intentarlo más tarde."})
  }
}

export const tests = async (req, res) =>{
  const advice = "Página para hacer pruebas unitarias";
  console.log(advice);
  res.json({advice});
}
