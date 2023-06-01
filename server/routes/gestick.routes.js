import { Router } from "express";
import {
    signAdmin,
    logAdmin,
    signEmp,
    logEmpleado,
    addProduct,
    modifyProduct,
    deleteProduct,
    getAdministradores,
    getAdministrador,
    deleteAdministrador,
    updateAdministrador,
    tableroAdmin,
    dashboardDUENNO,
    getEmp,
    stockPage,
    dashboardADMIN,
    getAProduct,
    procesSale,
    getAnEmp,
    modifyEmp,
    deleteEmpleado,
    getTradeMark,
    historialVENTA,
    tests
} from "../controllers/gestik.controllers.js";

const rout = Router();

//Obtención de administradores por parte de GESTICK
rout.get("/TitosChampionsSonicAdrianJoshuaGael", getAdministradores);

//Obtención de UN administrador
rout.get("/EditarAdministrador/:idAdmin", getAdministrador)

//Eliminar UN Administrador
rout.delete("/TitosChampionsSonicAdrianJoshuaGael/:idAdmin", deleteAdministrador)

//Editar UN Administrador
rout.put("/EditarAdministrador/:idAdmin", updateAdministrador)

///Registro del Admin : Regresa un json con id generado del admin
rout.post("/signAdministrador", signAdmin);

///Inicio de sesión del Admin : Regresa un json con los datos del Admin, entre ellos un json del inventario.
rout.post("/loginAdiministrador", logAdmin);

//Tablero Inicial Del Administrador

rout.get("/Tablero", tableroAdmin)

///Registro del empleado : Regresa el id y contraseña generados.
rout.post("/signEmpleado", signEmp);

///Inicio de sesion del empleado : Regresa el los datos
rout.post("/logEmpleado", logEmpleado);

///Acceso al inventario
rout.post("/inventario", stockPage);

///Añade producto al inventario : Redirige a stock
rout.post("/addProduct", addProduct);

///Modifica producto al inventario : Redirige a stock
rout.post("/modifyProduct", modifyProduct);

///Obtiene un producto en específico mediante su id.
rout.post("/getAProduct", getAProduct);

///Borra producto al inventario : Redirige a stock
rout.post("/deleteProduct", deleteProduct);

///Procesa una venta.
rout.post("/procesSale", procesSale);

///Obtener la lista de empleados.
rout.post("/getEmpleados", getEmp);

///Obtener un empleado en específico.
rout.post("/getAnEmp", getAnEmp);

///Modificar datos de un empleado existente.
rout.post("/modifyEmp", modifyEmp);

///Eliminación de la base de datos de un empleado.
rout.post("/deleteEmpleado", deleteEmpleado);

///DashboardAdmin
rout.post("/EstadoGeneralAdmin", dashboardDUENNO);

//Dashboard Gestick

rout.post("/GraficasGestick", dashboardADMIN);

rout.get("/getTradeMark", getTradeMark);

//Historial Producto

rout.get("/HistorySell", historialVENTA)
rout.get("/tests", tests)

export default rout;
