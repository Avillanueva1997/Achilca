<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Linea = $_POST['_Linea'];
$_MinusOneYear = $_Year - 1;
$month = date('m');
$trimestre = GetTrimestre($month);

$DataKpi = array();

$Meta = 0;

$sql ="select meta from meta_uptime where year = {$_Year} and linea_produccion = '".$_Linea."' and trimestre = '".$trimestre."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){
    while( $row = mysqli_fetch_array($result) ) {

        $Meta = $row['meta'];
    }
}

mysqli_free_result($result);

$sql = "select t1.diametro, sum(t1.hrs_disp) as hrs_disp, sum(t1.hrs_pp) as hrs_pp,sum(t1.produccion_neta) as produccion_neta, sum(t1.bola_observada) as bola_observada, sum(t1.scrap) as scrap, AVG(t1.sobre_peso) as sobre_peso, AVG(t1.bpm) as bpm, t2.weight
from okrs t1
inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
where YEAR(t1.fecha) = '".$_MinusOneYear."' and t1.linea_produccion = '".$_Linea."' group by t1.diametro, t2.weight;";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count != 0){
    
    $Uptime = 0;
    $Hrs_disp = 0;
    $Hrs_pp = 0;

    while( $row = mysqli_fetch_array($result) ) {

        $uptime = (($row['produccion_neta'] + $row['bola_observada'] + $row['scrap']) / ((($row['sobre_peso'] / 100) + 1) * $row['weight'] * $row['bpm'] * 60 / 1000));
        $Uptime += $uptime;
        $Hrs_disp += $row['hrs_disp']; 
        $Hrs_pp += $row['hrs_pp']; 
    }

    $Uptime = $Uptime / ($Hrs_disp - $Hrs_pp);
    $Uptime = round($Uptime, 3);

    $DataKpi[] = array(          
        'Month'=> $_MinusOneYear,
        'Value'=> $uptime
    );

} else {
    $sql = "select avg(data_real) as Value from database_uptime where year = '".$_MinusOneYear."' and linea_produccion = '".$_Linea."';";

    $result = mysqli_query($con,$sql);

    if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count != 0){
        
        $Uptime = 0;

        while( $row = mysqli_fetch_array($result) ) {
            $Uptime = $row['Value'] / 100;
            $Uptime = round($Uptime, 3);

            $DataKpi[] = array(          
                'Month'=> $_MinusOneYear,
                'Value'=> $Uptime
            );

        }

    } else {
        $DataKpi[] = array(            
            'Month'=> $_MinusOneYear,
            'Value'=> 0
        );
    }

}

mysqli_free_result($result);

$sqlMonth = "select * from month;";

$resultMonth = mysqli_query($con,$sqlMonth);

if (!$resultMonth ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Promedio = 0;

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];
    $description=$row['description'];

    if($_Year == '2020' && $code <= 5){
        $sql = "select data_real as Value, meta from database_uptime where year = '".$_Year."' and month = '".$code."' and linea_produccion = '".$_Linea."';"; 

        $result = mysqli_query($con,$sql);
    
        if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            while( $row = mysqli_fetch_array($result) ) {
    
                $Promedio +=  $row['Value'];
    
                if($row['Value'] == 0 || empty($row['Value'])){
                    $DataKpi[] = array(          
                        'CodeMonth'=> $code,
                        'Month'=> $description,
                        'Value'=> round(0, 3),
                        'Meta' => 0,
                        'desempenio' => 0
                    );
                } else {
                    $Desempenio = (($row['Value'] * 100) / ($row['meta'] * 100)) - 1;
                    $Desempenio = round($Desempenio,3);
    
                    $Value = $row['Value'] / 100;
                    $Value = round($Value,3);
                    $Meta = $row['meta'] / 100;
                    $Meta = round($Meta,3);
    
                    $DataKpi[] = array(          
                        'CodeMonth'=> $code,
                        'Month'=> $description,
                        'Value'=> $Value,
                        'Meta'=> $Meta,
                        'desempenio' => $Desempenio
                    );
    
                }
            }
    
        } else {
            $DataKpi[] = array(       
                'CodeMonth'=> $code,           
                'Month'=> $description,
                'Value'=> 0,
                'Meta' => 0,
                'desempenio' => 0
            );
        }
    
        mysqli_free_result($result);
    } else {
        $sql = "select t1.diametro, sum(t1.hrs_disp) as hrs_disp, sum(t1.hrs_pp) as hrs_pp,sum(t1.produccion_neta) as produccion_neta, sum(t1.bola_observada) as bola_observada, sum(t1.scrap) as scrap, AVG(t1.sobre_peso) as sobre_peso, AVG(t1.bpm) as bpm, t2.weight
        from okrs t1
        inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
        where YEAR(t1.fecha) = '".$_Year."' and MONTH(fecha) = '".$code."' and t1.linea_produccion = '".$_Linea."' group by t1.diametro, t2.weight;";     
    
        $result = mysqli_query($con,$sql);
    
        if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            $Uptime = 0;
            $Hrs_disp = 0;
            $Hrs_pp = 0;
    
            while( $row = mysqli_fetch_array($result) ) {
    
                $uptime = (($row['produccion_neta'] + $row['bola_observada'] + $row['scrap']) / ((($row['sobre_peso'] / 100) + 1) * $row['weight'] * $row['bpm'] * 60 / 1000));
                $Uptime += $uptime;
                $Hrs_disp += $row['hrs_disp']; 
                $Hrs_pp += $row['hrs_pp']; 
            }
    
            $Uptime = $Uptime / ($Hrs_disp - $Hrs_pp);
            $Promedio += $Uptime;
    
            $Desempenio = (($Uptime * 100 ) / ($Meta * 100)) - 1;
            $Desempenio = round($Desempenio, 3);
    
            $Uptime = $Uptime / 100;
            $Uptime = round($Uptime, 3);
    
            $Meta = $Meta / 100;
            $Meta = round($Meta, 3);
    
            $DataKpi[] = array(          
                'CodeMonth'=> $code,
                'Month'=> $description,
                'Value'=> $Uptime,
                'Meta' => $Meta,
                'desempenio' => $Desempenio
            );
    
        } else {
            $DataKpi[] = array(       
                'CodeMonth'=> $code,           
                'Month'=> $description,
                'Value'=> 0,
                'Meta' => 0,
                'desempenio' => 0
            );
        }
    
        mysqli_free_result($result);        
    }
}

mysqli_free_result($resultMonth);

$Promedio = $Promedio / 12;
$Promedio = $Promedio / 100;
$Promedio = round($Promedio, 3);

$DataKpi[] = array(         
    'Month'=> 'PROM.',
    'Value'=> $Promedio
);

close_conection($con);

$json_string = json_encode($DataKpi);

echo $json_string;

?>