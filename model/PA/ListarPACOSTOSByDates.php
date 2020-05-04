<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Table = $_POST['_Table'];
$_From = $_POST['_From'];
$_To = $_POST['_To'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "select code, tipo_evento, diametro, evento, fecha_evento 
from {$_Table}_cab
where (fecha_evento between '".$_From."' and '".$_To."')
ORDER BY CAST(code as SIGNED INTEGER) ASC;";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Eventos = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $tipo_evento=$row['tipo_evento'];
    $diametro=$row['diametro'];
    $evento=$row['evento'];
    $fecha_evento=$row['fecha_evento'];

    $Eventos[] = array(
                            'code'=>$code,
                            'tipo_evento'=>$tipo_evento,
                            'diametro'=>$diametro,
                            'evento'=>$evento,
                            'fecha_evento'=>$fecha_evento,
                            'status' => ''
    					 );
}

mysqli_free_result($result);

for ($i=0; $i < sizeof($Eventos); $i++) {
    $code_cabecera = $Eventos[$i]['code'];

    $sql = "select t1.code, t1.code_cab, t1.actividad, t1.fecha_eje, t1.area_res, t2.area, t1.persona_res, t3.name, t3.lastname, t1.status, t1.code_rea
    from {$_Table}_det t1
    inner join areas t2 on t1.area_res = t2.code 
    inner join users t3 on t1.persona_res = t3.code
    where t1.code_cab = '".$code_cabecera."'
    ORDER BY date_create;";

    $result = mysqli_query($con,$sql);

    if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    while($row = mysqli_fetch_array($result)) {
        $code = $row['code'];
        $code_cab = $row['code_cab'];
        $actividad = $row['actividad'];
        $fecha_eje = $row['fecha_eje'];
        $area_res = $row['area_res'];
        $area = $row['area'];
        $persona_res = $row['persona_res'];
        $name = $row['name'];
        $lastname = $row['lastname'];
        $status = $row['status'];
        $code_rea = $row['code_rea'];

        $Eventos[$i]['Actividades'][] = array(
            'code' => $code,
            'code_cab' => $code_cab,
            'actividad' => $actividad,
            'fecha_eje' => $fecha_eje,
            'area_res' => $area_res,           
            'area' => $area,
            'persona_res' => $persona_res,
            'responsable' => $lastname.', '.$name,
            'status' => $status,
            'code_rea' => $code_rea,
            'tipo_evento' => $Eventos[$i]['tipo_evento'],
            'diametro' => $Eventos[$i]['diametro']
        );
    } 	  
    
    mysqli_free_result($result);
}

close_conection($con);

$EventHierarchy = array(
    'Eventos' => $Eventos
);

$json_string = json_encode(compact('EventHierarchy'));

echo $json_string;

?>