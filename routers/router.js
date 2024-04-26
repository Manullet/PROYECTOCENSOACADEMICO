const express = require('express')
const router = express.Router()
const authcontrollers = require ('../Controllers/authcontrollers')
const conexion = require('../database/db')




//rotas para el metodo authcontrollers
   //rutas para el menu
   router.get('/', (req, res) => {

    res.render('index') 
   })

   router.get('/indexA', (req, res) => {

    res.render('indexA') 
   })

   router.get('/indexM', (req, res) => {

    res.render('indexM') 
   })
    //rotas para el LOGIN
    router.get('/login', (req, res) => {
      
         // Renderizar la vista normalmente si no hay un mensaje de bienvenida
         res.render('login', { alert: false });
      }
     );
     
  
    
   
   router.get('/forgot-password', (req, res) => {
    res.render('forgot-password') 
   })


   
   


    //Ruta dentro del Dashboard

    router.get('/tipocenso', (req, res) => {
      const query = `
          SELECT 
              U.nombre_usuario,
              C.nombre_carrera,
              E.nombre_estado,
              UN.nombre_universidad,
              TC.nombre_tipo_censo,
              H.hora_inicio,
              H.hora_final,
              H.dias
          FROM 
              (SELECT nombre_usuario, ROW_NUMBER() OVER (ORDER BY nombre_usuario) AS rn FROM TBL_USUARIOS) AS U
          JOIN 
              (SELECT nombre_carrera, ROW_NUMBER() OVER (ORDER BY nombre_carrera) AS rn FROM TBL_CARRERA) AS C
          ON U.rn = C.rn
          JOIN 
              (SELECT nombre_estado, ROW_NUMBER() OVER (ORDER BY nombre_estado) AS rn FROM TBL_ESTADO_CENSO) AS E
          ON U.rn = E.rn
          JOIN 
              (SELECT nombre_universidad, ROW_NUMBER() OVER (ORDER BY nombre_universidad) AS rn FROM TBL_UNIVERSIDAD) AS UN
          ON U.rn = UN.rn
          JOIN 
              (SELECT nombre_tipo_censo, ROW_NUMBER() OVER (ORDER BY nombre_tipo_censo) AS rn FROM TBL_TIPO_CENSO) AS TC
          ON U.rn = TC.rn
          JOIN 
              (SELECT hora_inicio, hora_final, dias, ROW_NUMBER() OVER (ORDER BY hora_inicio) AS rn FROM TBL_HORARIOS) AS H
          ON U.rn = H.rn;
      `;
  
      conexion.query(query, (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('tipocenso', { results: results });
          }
      });
    })


  router.get('/tipocensoA', (req, res) => {
    const query = `
        SELECT 
            U.nombre_usuario,
            C.nombre_carrera,
            E.nombre_estado,
            UN.nombre_universidad,
            TC.nombre_tipo_censo,
            H.hora_inicio,
            H.hora_final,
            H.dias
        FROM 
            (SELECT nombre_usuario, ROW_NUMBER() OVER (ORDER BY nombre_usuario) AS rn FROM TBL_USUARIOS) AS U
        JOIN 
            (SELECT nombre_carrera, ROW_NUMBER() OVER (ORDER BY nombre_carrera) AS rn FROM TBL_CARRERA) AS C
        ON U.rn = C.rn
        JOIN 
            (SELECT nombre_estado, ROW_NUMBER() OVER (ORDER BY nombre_estado) AS rn FROM TBL_ESTADO_CENSO) AS E
        ON U.rn = E.rn
        JOIN 
            (SELECT nombre_universidad, ROW_NUMBER() OVER (ORDER BY nombre_universidad) AS rn FROM TBL_UNIVERSIDAD) AS UN
        ON U.rn = UN.rn
        JOIN 
            (SELECT nombre_tipo_censo, ROW_NUMBER() OVER (ORDER BY nombre_tipo_censo) AS rn FROM TBL_TIPO_CENSO) AS TC
        ON U.rn = TC.rn
        JOIN 
            (SELECT hora_inicio, hora_final, dias, ROW_NUMBER() OVER (ORDER BY hora_inicio) AS rn FROM TBL_HORARIOS) AS H
        ON U.rn = H.rn;
    `;

    conexion.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('tipocensoA', { results: results });
        }
    });
   })
  

   router.get('/mostrarusuarios', (req, res) => {
    const query = `
       SELECT 
         P.nombres_persona,
         P.apellidos_persona,
         U.nombre_usuario,
         U.correo,
         R.rol,
         U.estado,
         UN.siglas
       FROM 
         tbl_usuarios U
       JOIN 
         tbl_ms_roles R ON U.tipo_rol = R.id_rol
       JOIN
         tbl_personas P ON U.id_persona = P.id_persona
       JOIN
         tbl_universidad UN ON P.id_universidad = UN.id_universidad
       JOIN
         tbl_carrera C ON P.id_carrera = C.id_carrera
    `;
   
    conexion.query(query, (error, results) => {
       if (error) {
         throw error;
       } else {
         res.render('mostrarusuarios', { results: results });
       }
    });
   });
   

   router.get('/mostraruniversidad', (req, res)=>{
        conexion.query('SELECT * FROM tbl_universidad', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('mostraruniversidad', { results: results });
        }
       })
   })
   router.get('/mostraruniversidad1', (req, res) => {
    conexion.query('SELECT * FROM tbl_universidad', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las universidades' });
        } else {
            // Devuelve los resultados como JSON
            res.json(results);
        }
    });
});

   router.get('/mostrar_modalidad', (req, res)=>{
   conexion.query('SELECT * FROM tbl_modalidad', (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('mostrar_modalidad', { results: results });
          }
      })
   })

   router.get('/mostrar_horarios', (req, res)=>{
   conexion.query('SELECT * FROM tbl_horarios', (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('mostrar_horarios', { results: results });
          }
      })
   })

   router.get('/mostrar_personas', (req, res) => {
    const query = `
        SELECT
            P.id_tipo_documento,
            P.numero_documento,
            P.nombres_persona,
            P.apellidos_persona,
            P.fecha_nacimiento,
            P.genero,
            P.direccion,
            P.telefono,
            U.nombre_universidad,
            CA.nombre_carrera
        FROM 
            tbl_personas P
        JOIN 
            tbl_universidad U ON P.id_universidad = U.id_universidad
        JOIN 
            tbl_carrera CA ON P.id_carrera = CA.id_carrera
    `;
 
    conexion.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('mostrar_personas', { results: results });
        }
    });
});
   



    


   router.get('/mostrar_horarios', (req, res)=>{
   conexion.query('SELECT * FROM tbl_horarios', (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('mostrar_horarios', { results: results });
          }
      })
   })

   router.get('/mostrar_edificios', (req, res)=>{
   conexion.query('SELECT * FROM tbl_edificio', (error, results) => {
    if (error) {
              throw error;
          } else {
              res.render('mostrar_edificios', { results: results });
          }
      })
   })
   
   router.get('/mostrar_clases', (req, res)=>{
    conexion.query('SELECT * FROM tbl_clase', (error, results) => {
     if (error) {
               throw error;
           } else {
               res.render('mostrar_clases', { results: results });
           }
       })
  })
  router.get('/mostrar_clasesA', (req, res)=>{
    conexion.query('SELECT * FROM tbl_clase', (error, results) => {
     if (error) {
               throw error;
           } else {
               res.render('mostrar_clasesA', { results: results });
           }
       })
  })

  router.get('/mostrar_clases1', (req, res)=>{
    conexion.query('SELECT * FROM tbl_clase', (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener las universidades' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
  });
  router.get('/usuarios1', (req, res)=>{
    conexion.query('SELECT p.nombres_persona, u.id_usuario, p.id_persona FROM tbl_usuarios u JOIN tbl_personas p ON u.id_persona = p.id_persona WHERE u.tipo_rol = 3', 
    (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
  });
  
  router.get('/edificios1', (req, res)=>{
    conexion.query('select * from tbl_edificio;', 
    (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener los edificios' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
  });

  router.get('/horarios1', (req, res)=>{
    conexion.query('select * from tbl_horarios;', 
    (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener los horarios' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
});   

router.get('/modalidades1', (req, res)=>{
  conexion.query('select * from tbl_modalidad;', 
  (error, results) => {
    if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las modalidades' });
    } else {
        // Devuelve los resultados como JSON
        res.json(results);
    }
  });
});

router.get('/aulas1', (req, res)=>{
  conexion.query('select * from tbl_aulas;', 
  (error, results) => {
    if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las aulas' });
    } else {
        // Devuelve los resultados como JSON
        res.json(results);
    }
  });
});

  router.get('/mostrar_roles', (req, res)=>{
    conexion.query('select * from tbl_ms_roles ', (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener los roles' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
  });

  router.get('/mostrar_universidades', (req, res)=>{
    conexion.query('select * from tbl_universidad ', (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener las universidades' });
      } else {
          // Devuelve los resultados como JSON
          res.json(results);
      }
    });
  });

  router.get('/mostrar_carreras', (req, res) => {
    // Obtén el id_universidad de los parámetros de la solicitud
    const { id_universidad } = req.query;

    // Asegúrate de que id_universidad esté definido y sea un número
    if (!id_universidad || isNaN(id_universidad)) {
        return res.status(400).json({ error: 'El parámetro id_universidad es requerido y debe ser un número.' });
    }

    // Construye la consulta SQL con el filtro por id_universidad
    const query = 'SELECT * FROM tbl_carrera WHERE Id_universidad = ?';

    // Ejecuta la consulta con el id_universidad como parámetro
    conexion.query(query, [id_universidad], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las carreras' });
        } else {
            // Devuelve los resultados como JSON
            res.json(results);
        }
    });
});

   
   router.get('/mostrar_carrera', (req, res)=>{
      conexion.query('SELECT * FROM tbl_carrera', (error, results) => {
       if (error) {
                 throw error;
             } else {
                 res.render('mostrar_carrera', { results: results });
             }
         })
   })
  
   router.get('/mostrartipos_aulas', (req, res)=>{
    conexion.query('SELECT * FROM tbl_tipo_aula', (error, results) => {
     if (error) {
               throw error;
           } else {
               res.render('mostrartipos_aulas', { results: results });
           }
       })
 })



 router.get('/mostrar_aulas', (req, res) => {
  const query = `
  SELECT      A.numero_aula,     E.nombre_edificio,     TA.nombre_tipo_aula,     C.capacidad
FROM      (SELECT numero_aula, ROW_NUMBER() OVER (ORDER BY numero_aula) AS rn FROM TBL_AULAS) AS A 
JOIN      (SELECT nombre_edificio, ROW_NUMBER() OVER (ORDER BY nombre_edificio) AS rn FROM TBL_EDIFICIO) AS E ON A.rn = E.rn 
JOIN      (SELECT nombre_tipo_aula, ROW_NUMBER() OVER (ORDER BY nombre_tipo_aula) AS rn FROM TBL_TIPO_AULA) AS TA ON A.rn = TA.rn 
JOIN      (SELECT capacidad, ROW_NUMBER() OVER (ORDER BY capacidad) AS rn FROM TBL_AULAS) AS C ON A.rn = C.rn;

  `;

  conexion.query(query, (error, results) => {
      if (error) {
          throw error;
      } else {
          res.render('mostrar_aulas', { results: results });
      }
  });
})


router.get('/CargaAcademica', (req, res) => {
  const query = `SELECT 
	c.nombre_clase,
    p.nombres_persona,
    e.nombre_edificio,
    a.numero_aula,
    a.capacidad,
    h.dias,
    m.nombre_modalidad,
    ca.cupos,
    ca.semestre,
    ca.ano
FROM 
    tbl_carga_academica ca
JOIN 
    tbl_personas p ON ca.id_persona = p.id_persona
JOIN 
    tbl_clase c ON ca.id_clase = c.id_clase
JOIN 
    tbl_aulas a ON ca.id_aula = a.numero_aula
JOIN 
    tbl_edificio e ON ca.id_edificio = e.id_edificio
JOIN 
    tbl_horarios h ON ca.id_horario = h.id_horario
JOIN 
    tbl_modalidad m ON ca.id_modalidad = m.id_modalidad;
  `;

  conexion.query(query, (error, results) => {
      if (error) {
          throw error;
      } else {
          res.render('CargaAcademica', { results: results });
      }
  });
})

router.get('/CargaAcademicaA', (req, res) => {
  const query = `
  SELECT 
  A.id_tipo_documento,
  E.numero_documento,
  TA_persona.nombres_persona,
  TC_clase.codigo_clase,
  TC_clase.nombre_clase,
  TA_edificio.nombre_edificio,
  C.nombre_tipo_aula,
  TC.nombre_modalidad,
  '60' AS cupo,
  '2025' AS ano,
  'I PAC' AS semestre
FROM 
  (SELECT id_tipo_documento, ROW_NUMBER() OVER (ORDER BY id_tipo_documento) AS rn FROM tbl_personas) AS A
JOIN 
  (SELECT numero_documento, ROW_NUMBER() OVER (ORDER BY numero_documento) AS rn FROM tbl_personas) AS E ON A.rn = E.rn
JOIN 
  (SELECT nombres_persona, ROW_NUMBER() OVER (ORDER BY nombres_persona) AS rn FROM tbl_personas) AS TA_persona ON A.rn = TA_persona.rn
JOIN 
  (SELECT codigo_clase, nombre_clase, ROW_NUMBER() OVER (ORDER BY codigo_clase) AS rn FROM TBL_CLASE) AS TC_clase ON A.rn = TC_clase.rn
JOIN 
  (SELECT nombre_edificio, ROW_NUMBER() OVER (ORDER BY nombre_edificio) AS rn FROM TBL_EDIFICIO) AS TA_edificio ON A.rn = TA_edificio.rn
JOIN 
  (SELECT nombre_tipo_aula, ROW_NUMBER() OVER (ORDER BY nombre_tipo_aula) AS rn FROM TBL_TIPO_AULA) AS C ON A.rn = C.rn
JOIN 
  (SELECT nombre_modalidad, ROW_NUMBER() OVER (ORDER BY nombre_modalidad) AS rn FROM tbl_modalidad) AS TC ON A.rn = TC.rn;
  `;

  conexion.query(query, (error, results) => {
      if (error) {
          throw error;
      } else {
          res.render('CargaAcademicaA', { results: results });
      }
  });
})
     



router.get('/Solicitud', (req, res) => {
  const userInfoString = req.cookies.userInfo;
          let id_universidad = null;
         
          if (userInfoString) {
             // Parsear la cadena de texto de la cookie a un objeto
             const userInfo = JSON.parse(userInfoString);
             // Extraer el id_usuario de la cookie
             id_universidad = userInfo.id_universidad;
          }
  let params = [id_universidad]
  const query = `
  SELECT C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final,
     COUNT(*) AS cantidad,
     S.id_clase, 
     GROUP_CONCAT(id_usuario ORDER BY id_usuario DESC) id_usuario,
     U.id_universidad 
  FROM 
     tbl_solicitar_clase S
  JOIN 
     tbl_clase C ON S.id_clase = C.id_clase
  JOIN 
     tbl_universidad U ON S.id_universidad = U.id_universidad
  WHERE
     U.id_universidad = ?
  GROUP BY 
     C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final,
     S.id_clase 
  `;

  conexion.query(query, params, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error al obtener los datos' });
    } else {
      res.render('Solicitud', { results: results });
      //res.json(results);
    }
 });
});


router.get('/SolicitudA', (req, res) => {
  const userInfoString = req.cookies.userInfo;
          let id_universidad = null;
         
          if (userInfoString) {
             // Parsear la cadena de texto de la cookie a un objeto
             const userInfo = JSON.parse(userInfoString);
             // Extraer el id_usuario de la cookie
             id_universidad = userInfo.id_universidad;
          }
  let params = [id_universidad]
  const query = `
  SELECT C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final,
     COUNT(*) AS cantidad,
     S.id_clase, 
     GROUP_CONCAT(id_usuario ORDER BY id_usuario DESC) id_usuario,
     U.id_universidad 
  FROM 
     tbl_solicitar_clase S
  JOIN 
     tbl_clase C ON S.id_clase = C.id_clase
  JOIN 
     tbl_universidad U ON S.id_universidad = U.id_universidad
  WHERE
     U.id_universidad = ?
  GROUP BY 
     C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final,
     S.id_clase 
  `;

  conexion.query(query, params, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error al obtener los datos' });
    } else {
      res.render('SolicitudA', { results: results });
      //res.json(results);
    }
 });
});


router.get('/mostrar_clasesuA', (req, res) => {
  const userInfoString = req.cookies.userInfo;
          let id_usuario = null;
         
          if (userInfoString) {
             // Parsear la cadena de texto de la cookie a un objeto
             const userInfo = JSON.parse(userInfoString);
             // Extraer el id_usuario de la cookie
             id_usuario = userInfo.id_usuario;
          }
  let params = [id_usuario]
  const query = `
  SELECT 
     C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final
 FROM 
     tbl_solicitar_clase S
 JOIN 
     tbl_clase C ON S.id_clase = C.id_clase
 JOIN 
     tbl_universidad U ON S.id_universidad = U.id_universidad
 WHERE
     S.id_usuario = ?
  `;

  conexion.query(query, params, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error al obtener los datos' });
    } else {
      res.render('mostrar_clasesuA', { results: results });
      //res.json(results);
    }
 });
});

router.get('/mostrar_clasesu', (req, res) => {
  const userInfoString = req.cookies.userInfo;
          let id_usuario = null;
         
          if (userInfoString) {
             // Parsear la cadena de texto de la cookie a un objeto
             const userInfo = JSON.parse(userInfoString);
             // Extraer el id_usuario de la cookie
             id_usuario = userInfo.id_usuario;
          }
  let params = [id_usuario]
  const query = `
  SELECT 
     C.nombre_clase,
     C.codigo_clase,
     U.nombre_universidad,
     S.hora_inicial,
     S.hora_final
 FROM 
     tbl_solicitar_clase S
 JOIN 
     tbl_clase C ON S.id_clase = C.id_clase
 JOIN 
     tbl_universidad U ON S.id_universidad = U.id_universidad
 WHERE
     S.id_usuario = ?
  `;

  conexion.query(query, params, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error al obtener los datos' });
    } else {
      res.render('mostrar_clasesu', { results: results });
      //res.json(results);
    }
 });
});
          // RUTAS PARA AGREGAR
          
      router.get( '/register', (req, res) =>{
      res.render('register')
      })

      router.get('/rmodalidad', (req, res)=>{
      res.render('rmodalidad')
      })
      //ruta para crear una nueva persona
      router.get('/npersonas', (req, res)=>{
      res.render('npersonas')
      })
    
      //ruta para crear una nueva aula
      router.get( '/createaula', (req, res) =>{
      res.render('createaula' ) 
      })
      
      //ruta para crear una nueva universidad 
      router.get( '/universidadcreate', (req, res) =>{
      res.render('universidadcreate' ) 
      })

      //rutas para el Registrar Un nuevo Edificio
     router.get( '/EdificioNuevo', (req, res) =>{
      res.render('edificioNuevo')
     })
          //rutas para el Registrar Un nuevo Horario
     router.get( '/HorarioNuevo', (req, res) =>{
     res.render('HorarioNuevo')
     }) 
      
     router.get( '/clasecreate', (req, res) =>{
      res.render('clasecreate' ) 
     })
     
     router.get( '/carreracreate', (req, res) =>{
        res.render('carreracreate' ) 
     })

     router.get( '/tipo_aulacreate', (req, res) =>{
      res.render('tipo_aulacreate' ) 
      })
  
      router.get( '/AulasCreate', (req, res) =>{
        res.render('AulasCreate')
        })
       //ruta para crear una nueva carga academica
      router.get( '/CargaAcademicaCreate', (req, res) =>{
        res.render('CargaAcademicaCreate' ) 
      })
      
      router.get( '/recupera', (req, res) =>{
        res.render('recupera')
        })

        
    router.get( '/Solicitud', (req, res) =>{
        res.render('Solicitud')
        })
    
    router.get( '/mostrac_clasesu', (req, res) =>{
          res.render('mostrar_clasesu' ) 
        })
        
        router.get( '/mostrar_clasesuA', (req, res) =>{
          res.render('mostrar_clasesuA' ) 
        })
        
    router.get('/solicitudcreate', (req, res) => {
          // Leer la cookie 'userInfo'
          const userInfoString = req.cookies.userInfo;
          let id_usuario = null;
         
          if (userInfoString) {
             // Parsear la cadena de texto de la cookie a un objeto
             const userInfo = JSON.parse(userInfoString);
             // Extraer el id_usuario de la cookie
             id_usuario = userInfo.id_usuario;
          }
         
          // Pasar el id_usuario a la vista
          res.render('solicitudcreate', { id_usuario: id_usuario });
    });
    

    router.get('/solicitudcreateA', (req, res) => {
      // Leer la cookie 'userInfo'
      const userInfoString = req.cookies.userInfo;
      let id_usuario = null;
     
      if (userInfoString) {
         // Parsear la cadena de texto de la cookie a un objeto
         const userInfo = JSON.parse(userInfoString);
         // Extraer el id_usuario de la cookie
         id_usuario = userInfo.id_usuario;
      }
     
      // Pasar el id_usuario a la vista
      res.render('solicitudcreate', { id_usuario: id_usuario });
});
    
     // RUTAS PARA EDITAR

     //Ruta para editar el usuario
    router.get( '/edit/:id_usuario', (req, res) =>{
      const id_usuario = req.params.id_usuario;
      conexion.query('SELECT * FROM tbl_usuarios Where id_usuario=?', [id_usuario], (error, results) => {
          if (error) {
            throw error;
          } else {
            res.render('edit', {user:results[0]});
          }
      })
  })
    // Ruta para editar la universidad
    router.get( '/edituniversidad/:id_universidad', (req, res) =>{
    const id_universidad = req.params.id_universidad;
    conexion.query('SELECT * FROM tbl_universidad  Where id_universidad=?', [id_universidad], (error, results) => {
        if (error) {
          throw error;
        } else {
          res.render('edituniversidad', {uni:results[0]});
        }
    })
  })
     // Ruta editar Modalidad
    router.get('/emodalidad/:id_modalidad', (req, res) => {
      const id_modalidad = req.params.id_modalidad;
    
      conexion.query('SELECT * FROM tbl_modalidad WHERE id_modalidad = ?', [id_modalidad], (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('emodalidad', { modalidad: results[0] });
          }
      });
  })
    
    // Ruta para editar la Persona
    router.get('/epersonas/:id_persona', (req, res) => {
      const id_persona = req.params.id_persona;
    
      conexion.query('SELECT * FROM tbl_personas WHERE id_persona = ?', [id_persona], (error, results) => {
          if (error) {
              throw error;
          } else {
              res.render('epersonas', { persona: results[0] });
          }
      });
   })
     //rutas para editar Horario
    router.get( '/HorarioEditar/:id_horario', (req, res) =>{
    const id_horario = req.params.id_horario;
    conexion.query('SELECT * FROM tbl_horarios  Where id_horario=?', [id_horario], (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render('HorarioEditar', {hor:results[0]});
      }
  })
   })   

   //rutas para editar Edificio
    router.get( '/EdificioEditar/:id_edificio', (req, res) =>{
    const id_edificio = req.params.id_edificio;
    conexion.query('SELECT * FROM tbl_edificio  Where id_edificio=?', [id_edificio], (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render('EdificioEditar', {edif:results[0]});
      }
  })
   })

   
   router.get( '/editclase/:id_clase', (req, res) =>{
    const id_clase = req.params.id_clase;
    conexion.query('SELECT * FROM tbl_clase  Where id_clase=?', [id_clase], (error, results) => {
        if (error) {
          throw error;
        } else {
          res.render('editclase', {clase:results[0]});
        }
    })
  })
  
  router.get( '/editcarrera/:id_carrera', (req, res) =>{
    const id_carrera = req.params.id_carrera;
    conexion.query('SELECT * FROM tbl_carrera  Where id_carrera=?', [id_carrera], (error, results) => {
        if (error) {
          throw error;
        } else {
          res.render('editcarrera', {carre:results[0]});
        }
    })
  })
  
  router.get( '/edittipo_aula/:id_tipo_aula', (req, res) =>{
    const id_tipo_aula = req.params.id_tipo_aula;
    conexion.query('SELECT * FROM tbl_tipo_aula  Where id_tipo_aula=?', [id_tipo_aula], (error, results) => {
        if (error) {
          throw error;
        } else {
          res.render('edittipo_aula', {tipo_aula:results[0]});
        }
    })
  })
  

    
 
   


//RUTA PARA INSERTAR
router.post('/login', authcontrollers.login)
router.post('/forgot-password', authcontrollers.forgotpassword)
router.post('/register', authcontrollers.register)
router.post('/universidadcreate', authcontrollers.universidadcreate)
router.post('/npersonas', authcontrollers.npersonas)
router.post('/rmodalidad', authcontrollers.rmodalidad)
router.post('/EdificioNuevo', authcontrollers.EdificioNuevo)
router.post('/HorarioNuevo', authcontrollers.HorarioNuevo)
router.post('/clasecreate', authcontrollers.clasecreate)
router.post('/clasecreate', authcontrollers.clasecreate)
router.post('/tipo_aulacreate', authcontrollers.tipo_aulacreate)
router.post('/carreracreate', authcontrollers.carreracreate)
router.post('/AulasCreate', authcontrollers.AulasCreate)
router.post('/solicitudcreate', authcontrollers.solicitudcreate)
router.post('/CargaAcademicaCreate', authcontrollers.CargaAcademicaCreate)
//router para los metodos Select de las tablas







//router para los metodos de editar
router.post('/editupdate/:id_usuario', authcontrollers.editupdate)
router.post('/editupdateuniversidad/:id_universidad', authcontrollers.editupdateuniversidad)
router.post('/emodalidad/:id_modalidad', authcontrollers.emodalidad)
router.post('/epersonas/:id_persona', authcontrollers.epersonas)
router.post('/EdificioEditar/:id_edificio', authcontrollers.EdificioEditar)
router.post('/HorarioEditar/:id_horario', authcontrollers.HorarioEditar)
router.post('/editupdateclase/:id_clase', authcontrollers.editupdateclase)
router.post('/editupdatecarrera/:id_carrera', authcontrollers.editupdatecarrera)
router.post('/editupdatetipo_aula/:id_tipo_aula', authcontrollers.editupdatetipo_aula)
router.post('/agregarSolicitud/:id_persona', authcontrollers.agregarsolicitud);
//metodo de actualizar solicitud
router.post('/eliminarSolicitud/:id_usuario', authcontrollers.eliminarSolicitud);


module.exports = router