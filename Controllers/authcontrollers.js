const jwt = require ('jsonwebtoken')
const bcryptjs= require('bcryptjs')
const conexion= require('../database/db')
const {promisify} = require('util')
const { error, Console } = require('console')
const { ifError } = require('assert')

//procedimientos para login
// Procedimientos para login
exports.login = async (req, res) => {
  try {
     const nombre_usuario = req.body.nombre_usuario;
     const contrasena = req.body.contrasena;
     if (!nombre_usuario || !contrasena) {
       // Manejo de errores de entrada
       res.render('login', {
         alert: true,
         alertTitle: "Advertencia",
         alertMessage: "Ingrese un usuario y contraseña",
         alertIcon: 'question',
         showConfirmButton: true,
         timer: false,
         ruta: 'login'
       });
     } else {
       conexion.query('SELECT * FROM tbl_usuarios WHERE nombre_usuario = ?', [nombre_usuario], async (error, results) => {
         if (error || results.length == 0 || !(await bcryptjs.compare(contrasena, results[0].contrasena))) {
           // Manejo de errores de autenticación o consulta
           console.log("Error al autenticar o consultar usuario:", error);
           res.render('login', {
             alert: true,
             alertTitle: "Advertencia",
             alertMessage: "Usuario y contraseña incorrecta",
             alertIcon: 'error',
             showConfirmButton: true,
             timer: false,
             ruta: 'login'
           });
         } else {
           // Inicio de sesión válido
           const id_usuario = results[0].id_usuario;
           const id_persona = results[0].id_persona;
           // Consultamos la tabla tbl_personas para obtener la información del usuario
           conexion.query('SELECT * FROM tbl_personas WHERE id_persona = ?', [id_persona], async (error, personResults) => {
             if (error || personResults.length == 0) {
               // Manejo de errores al consultar la tabla tbl_personas
               console.log("Error al consultar la tabla tbl_personas:", error);
               res.redirect('/error');
             } else {
               const userInfo = {
                 id_usuario: id_usuario,
                 nombre_usuario: nombre_usuario,
                 id_universidad: personResults[0].id_universidad, // Información de la universidad
                 id_carrera: personResults[0].id_carrera, // Información de la carrera
                 nombres_persona: personResults[0].nombres_persona, // Información de los nombres
                 apellidos_persona: personResults[0].apellidos_persona // Información de los apellidos
               };
               const userInfoString = JSON.stringify(userInfo);
               const token = jwt.sign({ id: id_usuario }, process.env.JWT_SECRETO, {
                 expiresIn: process.env.JWT_TIEMPO_EXPIRA
               });
               console.log("TOKEN: " + token + " para el USUARIO: " + nombre_usuario);
               const cookiesOptions = {
                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                 httpOnly: true
               };
               res.cookie('jwt', token, cookiesOptions);
               res.cookie('userInfo', userInfoString, {
                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                 httpOnly: false // httpOnly debe ser false para acceder desde el lado del cliente
               });
               
 
               // Roles y permisos según el usuario
               switch (results[0].tipo_rol) {
                 case 2:
                  // Redirigir o renderizar según el rol
                  res.render('index', {
                     alert: true,
                     alertTitle: "Conexion exitosa",
                     alertMessage: "Bienvenido",
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 800,
                     
                  });
                  
                  break;
                  
                 case 3:
                  // Redirigir o renderizar según el rol
                  res.render('indexM', {
                     alert: true,
                     alertTitle: "Conexion exitosa",
                     alertMessage: "Bienvenido",
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 800,
                     ruta: ''
                  });
                 
                  break;
                 case 4:
                  // Redirigir o renderizar según el rol
                  res.render('indexA', {
                     alert: true,
                     alertTitle: "Conexion exitosa",
                     alertMessage: "Bienvenido",
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 800,
                     ruta: ''
                  });
                 
                  break;
                 default:
                  res.redirect('/')
                 
               }
             }
           });
         }
       });
     }
  } catch (error) {
     console.log(error);
     // Manejo de errores generales
     res.redirect('/error');
  }
 }; 







//.........PROCEDIMIENTOS PARA REGISTRAR............................

//procedimientos para Registrar Usuarios
exports.register = async (req, res) => {
  try {
     const {
       id_tipo_documento,
       numero_documento,
       nombres_persona,
       apellidos_persona,
       fecha_nacimiento,
       genero,
       direccion,
       telefono,
       nombre_usuario,
       correo,
       contrasena,
       tipo_rol,
       estado,
       id_universidad,
       id_carrera 
     } = req.body;
 
     // Primero, insertamos los datos en tbl_personas
     conexion.query('INSERT INTO tbl_personas SET ?', {
       id_tipo_documento,
       numero_documento,
       nombres_persona,
       apellidos_persona,
       fecha_nacimiento,
       genero,
       direccion,
       telefono,
       id_universidad,
       id_carrera
       
     }, async (error, results) => {
       if (error) {
         console.log(error);
         // 
         return res.redirect('/error');
       }
 
       // Obtenemos el id_persona generado automáticamente
       const id_persona = results.insertId;
 
       // Luego, insertamos los datos en tbl_usuarios utilizando el id_persona
       let contrasenaHash = await bcryptjs.hash(contrasena, 8);
       conexion.query('INSERT INTO tbl_usuarios SET ?', {
         nombre_usuario,
         correo,
         contrasena: contrasenaHash,
         tipo_rol,
         estado,
         id_persona // Aquí usamos el id_persona obtenido de la inserción en tbl_personas
       }, (error, results) => {
         if (error) {
           console.log(error);
           // Aquí puedes manejar el error, por ejemplo, redirigiendo al usuario a una página de error
           return res.redirect('/error');
         }
 
         // Redirigimos al usuario a la página de inicio o donde desees
         res.redirect('/login');
       });
     });
  } catch (error) {
     console.log(error);
     // Aquí puedes manejar el error, por ejemplo, redirigiendo al usuario a una página de error
     res.redirect('/error');
  }
 }

 exports.npersonas = async (req, res) => {
  try {
     const idTipoDocumento = req.body.id_tipo_documento;
     const numeroDocumento = req.body.numero_documento;
     const nombresPersona = req.body.nombres_persona;
     const apellidosPersona = req.body.apellidos_persona;
     const fechaNacimiento = req.body.fecha_nacimiento;
     const genero = req.body.genero;
     const direccion = req.body.direccion;
     const telefono = req.body.telefono;
     const idUniversidad = req.body.id_universidad; 
     const idCarrera = req.body.id_carrera; 
     
     conexion.query(
       'INSERT INTO tbl_personas SET ?',
       {
           id_tipo_documento: idTipoDocumento,
           numero_documento: numeroDocumento,
           nombres_persona: nombresPersona,
           apellidos_persona: apellidosPersona,
           fecha_nacimiento: fechaNacimiento,
           genero: genero,
           direccion: direccion,
           telefono: telefono,
           id_universidad: idUniversidad, // Corregido aquí
           id_carrera: idCarrera // Corregido aquí
       },
       (error, results) => {
           if (error) {
               console.log(error);
           }
           res.redirect('/mostrar_personas'); 
       }
  );
   
  } catch (error) {
     console.log(error);
  }
 }
 




// Función para obtener el ID de la universidad
async function obtenerIdUniversidad(nombreUniversidad) {
  return new Promise((resolve, reject) => {
      conexion.query(
          'SELECT id_universidad FROM tbl_universidad WHERE nombre_universidad = ?',
          [nombreUniversidad],
          (error, results) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(results[0].id_universidad);
              }
          }
      );
  });
}

// Función para obtener el ID de la carrera
async function obtenerIdCarrera(nombreCarrera) {
  return new Promise((resolve, reject) => {
      conexion.query(
          'SELECT id_carrera FROM tbl_carrera WHERE nombre_carrera = ?',
          [nombreCarrera],
          (error, results) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(results[0].id_carrera);
              }
          }
      );
  });
}



//procedimientos para Registrar nueva modalidad
exports.rmodalidad = async (req, res)=>{
 
  try {
    const nombre_modalidad = req.body.nombre_modalidad

    conexion.query('INSERT INTO tbl_modalidad SET ?',{nombre_modalidad:nombre_modalidad },(error,results)=>{
     if (error) {Console.log(error) }
     res.redirect('/mostrar_modalidad')
    })

  } catch (error) {
    console.log(error)
  }

}

//procedimientos para Registrar Universidades
exports.universidadcreate = async (req, res) => {
  try {
     
      const siglas= req.body.siglas;
      const nombre_universidad = req.body.nombre_universidad;
     
      
      conexion.query('INSERT INTO tbl_universidad SET ?', {
         siglas: siglas,
         nombre_universidad: nombre_universidad,
        
      }, (error, results) => {
          if (error) {
              console.log(error);
          }
          res.redirect('/mostraruniversidad');
      });
  } catch (error) {
      console.log(error);
  }
}


//procedimientos para Registrar Edificios
exports.EdificioNuevo = async (req, res) => {
  try {
    
      const nombre_edificio = req.body.nombre_edificio;
      const id_edificio = req.body.id_edificio;

      
      conexion.query('INSERT INTO tbl_edificio SET ?', {
             nombre_edificio :nombre_edificio,
             id_edificio: id_edificio
            }, (error, results) => {
          if (error) {
              console.log(error); // Corregido 'Console' a 'console'
          }
          res.redirect('/mostrar_edificios');
      });
  } catch (error) {
      console.log(error);
  }
}

//procedimientos para Registrar nuevo Horario
exports.HorarioNuevo = async (req, res) => {
  try {
      const hora_inicio = req.body.hora_inicio;
      const hora_final = req.body.hora_final;
      const dias = req.body.dias;
      const id_horario= req.params.id_horario;
     
      
      conexion.query('INSERT INTO tbl_horarios SET ?', {
         hora_inicio :hora_inicio,
         hora_final : hora_final,
         dias:dias,
         id_horario:id_horario

      }, (error, results) => {
          if (error) {
              console.log(error);
          }
          res.redirect('/mostrar_horarios');
      });
  } catch (error) {
      console.log(error);
  }
}

exports.clasecreate = async (req, res) => {
  try {
     const codigo_clase = req.body.codigo_clase;
     const nombre_clase = req.body.nombre_clase;
 
     conexion.query('INSERT INTO tbl_clase SET ?', {
       codigo_clase: codigo_clase,
       nombre_clase: nombre_clase,
     }, (error, results) => {
       if (error) {
         console.log(error);
       }
       res.redirect('/mostrar_clases');
     });
  } catch (error) {
     console.log(error);
  }
 }

 exports.carreracreate = async (req, res) => {
  try {
    const id_universidad = req.body.id_universidad;
      const nombre_carrera = req.body.nombre_carrera;
     
      
      conexion.query('INSERT INTO tbl_carrera SET ?', {
        
         id_universidad: id_universidad,
         nombre_carrera: nombre_carrera,
        
      }, (error, results) => {
          if (error) {
              console.log(error); // Corregido 'Console' a 'console'
          }
          res.redirect('/mostrar_carrera');
      });
  } catch (error) {
      console.log(error);
  }
}


exports.tipo_aulacreate = async (req, res) => {
  try {
     const nombre_tipo_aula = req.body.nombre_tipo_aula;
 
     await conexion.query('INSERT INTO tbl_tipo_aula SET ?', {
       nombre_tipo_aula: nombre_tipo_aula,
     });
 
     res.redirect('/mostrartipos_aulas');
  } catch (error) {
     console.error('Error al crear el tipo de aula:', error);
     res.status(500).send('Error al crear el tipo de aula');
  }
 }

 exports.AulasCreate = async (req, res) => {
  try {
     const numero_aula = req.body.numero_aula;
     const capacidad  = req.body.capacidad ;
    
     conexion.query('INSERT INTO tbl_aulas SET ?', {
      numero_aula: numero_aula,
      capacidad: capacidad,
     }, (error, results) => {
       if (error) {
         console.log(error);
       }
       res.redirect('/mostrar_aulas');
     });
  } catch (error) {
     console.log(error);
  }
 }

 //procedimientos para Registrar nueva Solicitud de clase
 exports.solicitudcreate = async (req, res) => {
  try {
       const id_clase = req.body.id_clase;
       const id_universidad = req.body.id_universidad;
       const hora_inicial = req.body.hora_inicial;
       const hora_final = req.body.hora_final;
       const cupo = req.body.cupo;
       const id_usuario = req.body.id_usuario;
 
       // Verifica si ya existe una solicitud con los mismos datos
       conexion.query('SELECT * FROM tbl_solicitar_clase WHERE id_usuario = ? AND id_clase = ? AND hora_inicial = ? AND hora_final = ?', [id_usuario, id_clase, hora_inicial, hora_final], async (error, results) => {
           if (error) {
               console.log(error);
               res.status(500).send('Error al verificar la existencia de la solicitud');
               return;
           }
 
           // Si ya existe una solicitud con los mismos datos, no se permite insertar una nueva
           if (results.length > 0) {
               res.status(400).send('Ya existe una solicitud con los mismos datos');
               return;
           }
 
           // Realiza una consulta para contar las solicitudes por id_usuario
           conexion.query('SELECT COUNT(*) as solicitudes FROM tbl_solicitar_clase WHERE id_usuario = ?', [id_usuario], async (error, results) => {
               if (error) {
                  console.log(error);
                  res.status(500).send('Error al contar las solicitudes de clase');
                  return;
               }
 
               // Obtiene el conteo de solicitudes
               const solicitudes = results[0].solicitudes;
 
               // Define el límite de solicitudes
               const limiteSolicitudes = 5; // el límite es 5 solicitudes
 
               // Evalúa si el usuario ha alcanzado el límite de solicitudes
               if (solicitudes >= limiteSolicitudes) {
                  res.status(400).send('Alcanzaste el límite de solicitudes');
                  return;
               }
 
               // Si no se ha alcanzado el límite y no existe una solicitud con los mismos datos, procede a insertar la nueva solicitud
               try {
                  await conexion.query('INSERT INTO tbl_solicitar_clase SET ?', {
                       id_clase: id_clase,
                       id_universidad: id_universidad,
                       hora_inicial: hora_inicial,
                       hora_final: hora_final,
                       cupo: cupo,
                       id_usuario: id_usuario
                  });
                  res.redirect('/Solicitud');
               } catch (insertError) {
                  console.log(insertError);
                  res.status(500).send('Error al crear la solicitud de clase');
               }
           });
       });
  } catch (error) {
       console.log(error);
       res.status(500).send('Error interno del servidor');
  }
 }
 

 exports.CargaAcademicaCreate = async (req, res) => {
  try {
    const { id_persona, id_clase, id_aula, id_edificio, id_horario, id_modalidad, cupos, semestre, ano, id_usuario } = req.body;

    conexion.query('INSERT INTO tbl_carga_academica SET ?', {
        id_persona: id_persona,
        id_clase: id_clase,
        id_aula: id_aula,
        id_edificio: id_edificio,
        id_horario: id_horario,
        id_modalidad: id_modalidad,
        cupos: cupos,
        semestre: semestre,
        ano: ano,
        id_usuario: id_usuario
    }, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al insertar la carga académica' });
        } else {
            res.redirect('/CargaAcademica');
        }
    });
} catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
};



//.........PROCEDIMIENTOS PARA EDITAR............................
//procedimientos para Editar Usuarios
 exports.editupdate = async (req, res) => {
  try {
        const nombre_completo = req.body.nombre_completo;
        const nombre_usuario = req.body.nombre_usuario;
        const correo = req.body.correo;
        const contrasena = req.body.contrasena;
        let contrasenaHash = contrasena ? await bcryptjs.hash(contrasena, 8) : null;
        const tipo_rol = req.body.tipo_rol;
        const estado = req.body.estado;
        const id_usuario = req.params.id_usuario; //
        let params = [nombre_completo, nombre_usuario, correo, contrasenaHash, tipo_rol, estado, id_usuario];
        params = params.filter(param => param !== null);
        conexion.query(`UPDATE tbl_usuarios SET nombre_completo = ?, nombre_usuario = ?, correo = ?, contrasena = ?, tipo_rol = ?, estado = ? WHERE id_usuario = ?`, params, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al actualizar el usuario');
            } else {
                res.redirect(`/`); // Redirección con ID del usuario
            }
        });
  } catch (error) {
        console.log(error);
        res.status(500).send('Error al actualizar el usuario');
  }
 }

 //Procedimiento para Editar Universidad
 exports.editupdateuniversidad = async (req, res) => {
  try {
    const siglas = req.body.siglas;
     const nombre_universidad = req.body.nombre_universidad;
     const id_universidad = req.params.id_universidad;
 
     let params = [siglas, nombre_universidad, id_universidad];
 
     await conexion.query(`UPDATE tbl_universidad SET siglas = ?, nombre_universidad = ? WHERE id_universidad = ?`, params);
     res.redirect('/mostraruniversidad');
  } catch (error) {
     console.error('Error al actualizar la universidad:', error);
     res.status(500).send('Error al actualizar la universidad');
  }
 }

// Procedimiento para editar la Persona
exports.epersonas = async (req, res) => {
  try {
    const tipo_documento = req.body.tipo_documento;
    const numero_documento = req.body.numero_documento;
    const nombres_persona = req.body.nombres_persona;
    const apellidos_persona = req.body.apellidos_persona;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const genero = req.body.genero;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;
    const nombre_carrera = req.body.nombre_carrera;
    const nombre_universidad = req.body.nombre_universidad;
    const id_persona = req.params.id_persona;

    let params = [tipo_documento, numero_documento, nombres_persona, apellidos_persona, fecha_nacimiento, genero, direccion, telefono, nombre_carrera, nombre_universidad, id_persona];

    await conexion.query(`UPDATE tbl_personas SET 
      id_tipo_documento = ?, 
      numero_documento = ?, 
      nombres_persona = ?, 
      apellidos_persona = ?, 
      fecha_nacimiento = ?, 
      genero = ?, 
      direccion = ?, 
      telefono = ?, 
      nombre_carrera = ?, 
      nombre_universidad = ? 
      WHERE id_persona = ?`, params);

    res.redirect('/mostrar_personas');
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    res.status(500).send('Error al actualizar la persona');
  }
}

// Procedimiento para editar la Modalidad
exports.emodalidad = async (req, res) => {
  try {
    const nombre_modalidad = req.body.nombre_modalidad;
    const id_modalidad = req.params.id_modalidad;
    
    let params = [nombre_modalidad, id_modalidad ];

    await conexion.query(`UPDATE tbl_modalidad SET nombre_modalidad = ? WHERE id_modalidad = ?`, params);
    res.redirect('/mostrar_modalidad');
  } catch (error) {
    console.error('Error al actualizar la modalidad:', error);
    res.status(500).send('Error al actualizar la modalidad');
  }
}

//Procedimiento para Editar Edificio
exports.EdificioEditar = async (req, res) => {
  try {
    const id_edificio = req.body.id_edificio;
    const nombre_edificio = req.body.nombre_edificio;
 
    let params = [nombre_edificio, id_edificio];
 
    await conexion.query(`UPDATE tbl_edificio SET nombre_edificio = ? WHERE id_edificio = ?`, params);
    res.redirect('/mostrar_edificios');
  } catch (error) {
    console.error('Error al actualizar Edificio:', error);
    
    res.status(500).send('Error al actualizar Edificio');
  }
}

//Procedimiento para Editar Horario
exports.HorarioEditar = async (req, res) => {
  try {
      const hora_inicio = req.body.hora_inicio;
      const hora_final = req.body.hora_final;
      const dias = req.body.dias;
      const id_horario = req.body.id_horario;

      let params = [hora_inicio,hora_final,dias,id_horario];
 
      await conexion.query(`UPDATE tbl_horarios SET hora_inicio = ?, hora_final = ?, dias = ? WHERE id_horario = ?`, params);
      res.redirect('/mostrar_horarios');
    } catch (error) {
      console.error('Error al actualizar Horario:', error);
      res.status(500).send('Error al actualizar Horario');
  }
}

exports.editupdateclase = async (req, res) => {
  try {
     const codigo_clase = req.body.codigo_clase;
     const nombre_clase = req.body.nombre_clase;
     const id_clase = req.params.id_clase;
 
     let params = [codigo_clase, nombre_clase, id_clase];
 
     await conexion.query(`UPDATE TBL_CLASE SET codigo_clase = ?, nombre_clase = ? WHERE id_clase = ?`, params);
     res.redirect('/mostrar_clases');
  } catch (error) {
     console.error('Error al actualizar la Clase:', error);
     res.status(500).send('Error al actualizar');
  }
}

exports.editupdatecarrera = async (req, res) => {
  try {

    
     const nombre_carrera = req.body.nombre_carrera;
      const id_carrera = req.params.id_carrera;
 
     let params = [ nombre_carrera, id_carrera];
 
     await conexion.query(`UPDATE tbl_carrera SET nombre_carrera = ?  WHERE id_carrera = ?`, params);
     res.redirect('/mostrar_carrera');
  } catch (error) {
     console.error('Error al actualizar la Carrera:', error);
     res.status(500).send('Error al actualizar la Carrera');
  }
 }

 exports.editupdatetipo_aula = async (req, res) => {
  try {
     const nombre_tipo_aula = req.body.nombre_tipo_aula;
     const id_tipo_aula = req.params.id_tipo_aula;
 
     await conexion.query('UPDATE tbl_tipo_aula SET nombre_tipo_aula = ? WHERE id_tipo_aula = ?', [nombre_tipo_aula, id_tipo_aula]);
 
     res.redirect('/mostrartipos_aulas');
  } catch (error) {
     console.error('Error al actualizar el tipo de aula:', error);
     res.status(500).send('Error al actualizar el tipo de aula');
  }
 }

  //Procedimientos para Actualizar Solicitud
 // Controlador para Agregar Solicitud
 exports.agregarsolicitud = async (req, res) => {
  const { id_clase, id_universidad, hora_inicial, hora_final, id_usuario } = req.body;
 
  try {
      await conexion.query('INSERT INTO TBL_SOLICITAR_CLASE (id_clase, id_universidad, hora_inicial, hora_final, Cupo, id_usuario) VALUES (?, ?, ?, ?, 1, ?)', [id_clase, id_universidad, hora_inicial, hora_final, id_usuario]);
      res.redirect('/Solicitud');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la solicitud');
  }
};




 

// Controlador para Eliminar Solicitud
exports.eliminarSolicitud = async (req, res) => {
try {
const id_clase = req.body.id_clase;
const id_usuario = req.body.id_usuario;
await conexion.query('DELETE FROM TBL_SOLICITAR_CLASE WHERE id_clase = ? AND id_usuario = ?', [id_clase, id_usuario]);

   res.redirect('/Solicitud');
} catch (error) {
   console.error('Error al remover la clase:', error);
   res.status(500).send('Error al actualizar la clase');
}
}

exports.forgotpassword = async (req, res) => {
  try {

     console.log("funcionando forgot-password")
    } catch (error) {
      console.error('Error al actualizar Solicitud:', error);
      res.status(500).send('Error al actualizar Solicitud');
  }
}


