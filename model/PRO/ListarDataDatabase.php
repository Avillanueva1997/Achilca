<?php

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$_Year = $_POST['_Year'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Actividad = $_POST['_Actividad'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlMonth = "select * from month";

$resultMonth = mysqli_query($con,$sqlMonth);

if (!$resultMonth ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$DataDatabase = array();

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];

    if($_Actividad == 'Producción'){
        $sql = "select sum(produccion_neta) as Value from cierre_okrs where YEAR(fecha)  = '".$_Year."' and MONTH(fecha) = '".$code."' and linea_produccion = '".$_LineaProduccion."';";        
    } else {
        $sql = "select t1.diametro, sum(t1.hrs_pp) as hrs_pp,sum(t1.produccion_neta) as produccion_neta, sum(t1.bola_observada) as bola_observada, sum(t1.scrap) as scrap, AVG(t1.sobre_peso) as sobre_peso, AVG(t1.bpm) as bpm, t2.weight
        from okrs t1
        inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
        where YEAR(t1.fecha) = '".$_Year."' and MONTH(fecha) = '".$code."' and t1.linea_produccion = '".$_LineaProduccion."' group by t1.diametro, t2.weight;;";
    }
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    if($row_count != 0){

        if($_Actividad == 'Producción'){

            while( $row = mysqli_fetch_array($result) ) {

                $DataDatabase[] = array(          
                    'Month'=> $code,
                    'Value'=> $row['Value']
                );
            }           

        } else {

            $Uptime = 0;

            while( $row = mysqli_fetch_array($result) ) {

                $uptime = (($row['produccion_neta'] + $row['bola_observada'] + $row['scrap']) / ((($row['sobre_peso'] / 100) + 1) * $row['weight'] * $row['bpm'] * 60 / 1000)) / (12 - $row['hrs_pp']);
                $uptime = intval($uptime);
                $uptime = $uptime * 100;
                $Uptime += $uptime;
            }

            $Uptime = $Uptime / $row_count;

            $DataDatabase[] = array(          
                'Month'=> $code,
                'Value'=> $Uptime
            );            
        }

    } else {
        $DataDatabase[] = array(                  
            'Month'=> $code,
            'Value'=> 0
        );
    }

    mysqli_free_result($result);
}

mysqli_free_result($resultMonth);

close_conection($con);

$json_string = json_encode($DataDatabase);

echo $json_string;

?>