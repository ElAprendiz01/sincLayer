import'./App.css'
import { useState, useEffect } from 'react';
function Listar_Cls_Tipo_Catalogo(){
    const[VariableTipo_Catalogo, setfunccionTipo_Catalogo] = useState([]);
    useEffect(()=>{
        fetch("http://localhost:5082/api/Cls_Tipo_Catalogo_")
        .then((res)=> res.json())
        .then((data)=>{
            setfunccionTipo_Catalogo(data);
        })
        .catch((err)=>console.log("Error traer datos:",err));
    },[]);
    return(
        <div>
            <h2>Lista de Tipo Catalogo</h2>
           <table className='Tabla-Tipo_Catalogo'>
            <thead>
                <th>Id</th>
                <th>Nombre</th>
                <th>Fecha de creacion</th>
                <th>fecha_Modificacion</th>
                <th>id_Creador</th>
                <th>id_Modificador</th>
                <th>activo</th>
            </thead>
            <tbody>
                {
                    VariableTipo_Catalogo.map((item)=>(
                         <tr key={item.id_Tipo_Catalogo}>
                            <td>{item.id_Tipo_Catalogo}</td>
                            <td>{item.nombre}</td>
                            <td>{item.fecha_Creacion}</td>
                            <td>{item.fecha_Modificacion}</td>
                            <td>{item.id_Creador}</td>
                            <td>{item.id_Modificador}</td>
                            <td>{item.activo}</td>



                         </tr>

                    ))
                   
                }
            </tbody>
           </table>

        </div>
    )
}
export default Listar_Cls_Tipo_Catalogo;